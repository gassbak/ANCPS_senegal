const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const SOURCES = [
  {
    name: "ANAQ-Sup",
    urls: ["https://anaqsup.sn/accreditations/", "https://anaqsup.sn/"],
    official: true
  },
  { name: "ONFP", urls: ["https://onfp.sn/"], official: true },
  { name: "3FPT", urls: ["https://3fpt.sn/"], official: true },
  { name: "MEFPT", urls: ["https://mefpt.org/"], official: true },
  {
    name: "SenCampus",
    urls: ["https://www.sencampus.com/", "https://www.sencampus.com/formations"],
    official: false
  },
  { name: "SamaBac", urls: ["https://samabac.sn/"], official: false },
  {
    name: "Campus Sénégal",
    urls: ["https://campussenegal.sec.gouv.sn/"],
    official: true
  },
  { name: "GOMYCODE Sénégal", urls: ["https://gomycode.com/sn/fr/"], official: false },
  {
    name: "ISM Online / ISF",
    urls: [
      "https://online.groupeism.sn/formations-diplomantes",
      "https://online.groupeism.sn/formations-isf-certifiantes"
    ],
    official: false
  },
  { name: "UN-CHK", urls: ["https://unchk.sn/"], official: true }
];

const TRAINING_TERMS =
  /formation|form(at|er|ation)|programme|dipl[oô]me|certificat|certification|licence|master|bachelor|bootcamp|cours|fili[eè]re|accr[eé]dit|enseignement|professionnel|[eé]tude/i;
const QUALIFICATION_TERMS =
  /formation|dipl[oô]me|certificat|certification|licence|master|bachelor|bootcamp|\b(bts|bt|cap)\b|accr[eé]dit/i;
const GENERIC_TITLES =
  /^(accueil|home|en savoir plus|d[eé]couvrir|nos formations|formations?|nos programmes|programmes?|accr[eé]ditations?|bootcamp|cours avanc[eé]|introduction|voir plus|lire la suite|contact|trouver une formation|toutes les formations|dipl[oô]mes?|formation [àa] distance)$/i;
const NON_COURSE_TITLES =
  /^(appel [àa] manifestation|minist[eè]re\b|portail\b|[ée]tablissements de formation)|\b(apply|filter)\b/i;
const EDITORIAL_PATHS = /\/(actus-conseils|dossiers|actualites|category|blog)(\/|$)/i;
const SOCIAL_HOSTS =
  /(^|\.)((facebook|instagram|linkedin|tiktok|twitter|x|youtube|youtu)\.com|youtu\.be|wa\.me)$/i;
const OFFICIAL_LINK_LABELS =
  /\b(site officiel|site web|site internet|website|official website|visiter le site)\b/i;
const MAX_DISCOVERED_PAGES = 2;
const REQUEST_TIMEOUT_MS = 15000;

const cleanText = (value) =>
  value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();

const isUsefulTitle = (title) =>
  title.length >= 8 && title.length <= 180 && !GENERIC_TITLES.test(title);

function resolveSourceUrl(href, pageUrl) {
  if (!href) return null;

  try {
    const url = new URL(href, pageUrl);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (EDITORIAL_PATHS.test(url.pathname)) return null;
    if (/\/advertisements\/\d+\/click\/?$/i.test(url.pathname)) return null;
    if (/\/formations\/?$/i.test(url.pathname) && url.searchParams.has("q")) {
      return null;
    }

    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function getContainerSourceUrl($, container, pageUrl) {
  const pageHost = new URL(pageUrl).hostname;
  const links = [];

  container.find("a[href]").each((_, element) => {
    const anchor = $(element);
    const sourceUrl = resolveSourceUrl(anchor.attr("href"), pageUrl);
    if (!sourceUrl) return;

    const url = new URL(sourceUrl);
    if (url.hostname === pageHost || SOCIAL_HOSTS.test(url.hostname)) return;

    const label = [
      anchor.text(),
      anchor.attr("title"),
      anchor.attr("aria-label")
    ]
      .filter(Boolean)
      .join(" ");
    links.push({
      sourceUrl,
      isOfficialLink: OFFICIAL_LINK_LABELS.test(label)
    });
  });

  const officialLink = links.find((link) => link.isOfficialLink);
  if (officialLink) return officialLink.sourceUrl;
  if (links.length > 0) return links[0].sourceUrl;

  let pageLink = null;
  container.find("a[href]").each((_, element) => {
    if (pageLink) return;
    pageLink = resolveSourceUrl($(element).attr("href"), pageUrl);
  });
  return pageLink;
}

function getDomain(text) {
  if (/cyber|informatique|num[eé]rique|digital|data|logiciel|d[eé]veloppe/i.test(text)) {
    return "Numérique";
  }
  if (/comptabilit[eé]|finance|audit|gestion/i.test(text)) {
    return "Gestion / Finance";
  }
  if (/sant[eé]|m[eé]dic|infirm/i.test(text)) {
    return "Santé";
  }
  if (/agricultur|[eé]levage|p[eê]che/i.test(text)) {
    return "Agriculture";
  }
  return "À préciser";
}

function getLevel(text) {
  if (/doctorat|doctoral/i.test(text)) return "Doctorat";
  if (/master|bac\s*\+\s*[45]/i.test(text)) return "Master";
  if (/licence|bachelor|bac\s*\+\s*3/i.test(text)) return "Licence";
  if (/\b(bts|bt|cap)\b/i.test(text)) return "Professionnel";
  if (/certificat|certification|bootcamp/i.test(text)) return "Certification";
  return "À préciser";
}

function getDeliveryMode(text) {
  if (/hybride|en ligne.*pr[eé]sentiel|pr[eé]sentiel.*en ligne/i.test(text)) {
    return "Hybride";
  }
  if (/en ligne|[àa] distance|online|e-learning/i.test(text)) return "À distance";
  if (/pr[eé]sentiel/i.test(text)) return "Présentiel";
  return "À préciser";
}

function getContentContainer($, element) {
  let container = $(element);
  for (let depth = 0; depth < 5 && container.length; depth += 1) {
    const className = container.attr("class") || "";
    if (
      container.is("article, li, tr") ||
      /(^|[\s_-])(card|course|formation|program|programme|accreditation|listing)([\s_-]|$)/i.test(
        className
      )
    ) {
      return container;
    }
    container = container.parent();
  }
  return $(element).parent();
}

function getHeading(container) {
  return cleanText(container.find("h1, h2, h3, h4").first().text());
}

function extractFromPage(html, pageUrl, source) {
  const $ = cheerio.load(html);
  const entries = new Map();

  function addEntry(title, description, sourceUrl) {
    const normalizedTitle = cleanText(title);
    const normalizedDescription = cleanText(description);
    if (
      !isUsefulTitle(normalizedTitle) ||
      NON_COURSE_TITLES.test(normalizedTitle) ||
      GENERIC_TITLES.test(normalizedTitle) ||
      !QUALIFICATION_TERMS.test(normalizedTitle)
    ) {
      return;
    }

    const key = `${source.name}:${normalizedTitle.toLowerCase()}`;
    if (entries.has(key)) return;

    const context = `${normalizedTitle} ${normalizedDescription}`;
    entries.set(key, {
      title: normalizedTitle,
      description: normalizedDescription.slice(0, 1000),
      organization: source.name,
      domain: getDomain(context),
      type: /certificat|certification/i.test(context)
        ? "Certification"
        : "Formation / Diplôme",
      level: getLevel(context),
      location: "Sénégal",
      delivery_mode: getDeliveryMode(context),
      verification_status: "À vérifier",
      ...(sourceUrl ? { source_url: sourceUrl } : {}),
      last_verified_at: new Date().toISOString().slice(0, 10)
    });
  }

  $("a[href]").each((_, element) => {
    const container = getContentContainer($, element);
    const containerText = cleanText(container.text());
    const heading = getHeading(container);
    const linkText = cleanText($(element).text());
    const href = $(element).attr("href");
    const sourceUrl = getContainerSourceUrl($, container, pageUrl) ||
      resolveSourceUrl(href, pageUrl);
    const title = isUsefulTitle(heading) ? heading : linkText;

    if (containerText.length <= 1600) {
      addEntry(title, containerText, sourceUrl);
    }
  });

  $("table tr").each((_, row) => {
    const cells = $(row)
      .find("th, td")
      .map((__, cell) => cleanText($(cell).text()))
      .get();
    if (cells.length < 2) return;

    const title = cells.find((cell) => isUsefulTitle(cell));
    if (title) {
      addEntry(title, cells.join(" | "), getContainerSourceUrl($, $(row), pageUrl));
    }
  });

  $("article, [class*='card'], [class*='formation'], [class*='programme'], [class*='course'], [class*='accreditation']")
    .each((_, element) => {
      const container = $(element);
      const text = cleanText(container.text());
      const title = getHeading(container);
      const sourceUrl = getContainerSourceUrl($, container, pageUrl);
      if (text.length <= 1600) addEntry(title, text, sourceUrl);
    });

  return {
    entries: [...entries.values()],
    discoveredUrls: discoverCatalogUrls($, pageUrl)
  };
}

function discoverCatalogUrls($, pageUrl) {
  const current = new URL(pageUrl);
  const urls = new Set();
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    const label = cleanText($(element).text());
    if (!href || !TRAINING_TERMS.test(`${href} ${label}`)) return;

    try {
      const candidate = new URL(href, pageUrl);
      if (
        candidate.hostname === current.hostname &&
        candidate.pathname !== current.pathname &&
        !EDITORIAL_PATHS.test(candidate.pathname) &&
        !/contact|connexion|login|inscription|actualit[eé]s|blog/i.test(candidate.pathname)
      ) {
        candidate.hash = "";
        urls.add(candidate.href);
      }
    } catch (error) {
      console.warn(`Lien ignoré sur ${pageUrl}: ${error.message}`);
    }
  });

  return [...urls].slice(0, MAX_DISCOVERED_PAGES);
}

async function fetchPage(url) {
  const { data } = await axios.get(url, {
    timeout: REQUEST_TIMEOUT_MS,
    maxRedirects: 5,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml"
    }
  });
  return typeof data === "string" ? data : "";
}

async function mapWithLimit(items, limit, handler) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await handler(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function scrapeSource(source) {
  const visited = new Set();
  const entries = new Map();
  const errors = [];
  let successCount = 0;
  let discoveredUrls = [];

  for (const url of source.urls) {
    try {
      const html = await fetchPage(url);
      visited.add(url);
      successCount += 1;
      const page = extractFromPage(html, url, source);
      for (const entry of page.entries) entries.set(entry.title.toLowerCase(), entry);
      discoveredUrls = discoveredUrls.concat(page.discoveredUrls);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }

  const pagesToFetch = [...new Set(discoveredUrls)]
    .filter((url) => !visited.has(url))
    .slice(0, MAX_DISCOVERED_PAGES);

  const discoveredResults = await mapWithLimit(pagesToFetch, 2, async (url) => {
    try {
      const html = await fetchPage(url);
      successCount += 1;
      return { url, page: extractFromPage(html, url, source) };
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
      return null;
    }
  });

  for (const result of discoveredResults.filter(Boolean)) {
    for (const entry of result.page.entries) entries.set(entry.title.toLowerCase(), entry);
  }

  return {
    name: source.name,
    count: entries.size,
    successCount,
    errors,
    entries: [...entries.values()]
  };
}

async function scrapeFormations() {
  const results = await mapWithLimit(SOURCES, 4, scrapeSource);
  const formations = results.flatMap((result) => result.entries);
  const outputPath = path.join(__dirname, "..", "formations_scrappees.json");

  fs.writeFileSync(outputPath, JSON.stringify(formations, null, 2), "utf-8");

  for (const result of results) {
    if (result.errors.length === 0) {
      console.log(`${result.name}: ${result.count} formation(s) extraites.`);
    } else if (result.successCount > 0) {
      console.warn(
        `${result.name}: ${result.count} formation(s); certaines pages n'ont pas répondu: ` +
          result.errors.join(" ; ")
      );
    } else {
      console.warn(
        `${result.name}: source inaccessible: ${result.errors.join(" ; ")}`
      );
    }
  }

  console.log(
    `${formations.length} formation(s) enregistrées dans ${outputPath}. ` +
      "Le statut de vérification reste « À vérifier »."
  );

  if (results.every((result) => result.errors.length > 0)) {
    throw new Error("Aucune source n'a pu être consultée.");
  }

  return formations;
}

if (require.main === module) {
  scrapeFormations().catch((error) => {
    console.error("Échec du scraping :", error.message);
    process.exitCode = 1;
  });
}

module.exports = { extractFromPage, scrapeFormations };
