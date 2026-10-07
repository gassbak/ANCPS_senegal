import { request } from "./api";

export async function trackAnalytics(type, data = {}) {
    if (!type) {
        throw new Error("Le type Analytics est obligatoire");
    }

    return request("/analytics", {
        method: "POST",
        body: JSON.stringify({
            type,
            ...data,
        }),
    });
}