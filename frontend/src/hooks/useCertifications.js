import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

export default function useCertifications(search = "") {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCertifications = async () => {
    setLoading(true);

    try {
      const data = await api.getCertifications();
      setCertifications(data);
    } catch (error) {
      console.error("Erreur certifications :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const filteredCertifications = useMemo(() => {
    if (!search.trim()) {
      return certifications;
    }

    const value = search.toLowerCase();

    return certifications.filter((certification) =>
      [
        certification.title,
        certification.organization,
        certification.sector,
        certification.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [certifications, search]);

  return {
    certifications: filteredCertifications,
    loading,
    reload: loadCertifications,
  };
}