const BASE_URL = "http://localhost:1337/fisioterapista";

// Contenitore per le funzioni di autenticazione fornite dal Context
let authHelpers = {
    refreshToken: async (): Promise<void> => {
        throw new Error("Auth helpers not initialized. Call initApi from AuthProvider.");
    },
    logout: (): void => {
        throw new Error("Auth helpers not initialized. Call initApi from AuthProvider.");
    },
};

export const initApi = (helpers: typeof authHelpers) => {
    authHelpers = helpers;
};


const authedFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
    const url = `${BASE_URL}${path}`;
    const currentToken = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        "Authorization": `Bearer ${currentToken}`,
    };

    let response = await fetch(url, { ...options, headers });

    // Se il token è scaduto (401), prova a fare il refresh
    if (response.status === 401) {
        console.log("Token scaduto o non valido. Tento il refresh...");
        try {
            // Usa la funzione di refresh fornita dal context
            await authHelpers.refreshToken();
            const newToken = localStorage.getItem("token"); // Prendi il nuovo token aggiornato

            // Ripeti la richiesta originale con il nuovo token
            console.log("Token aggiornato. Ripeto la richiesta originale...");
            const newHeaders = { ...headers, "Authorization": `Bearer ${newToken}` };
            response = await fetch(url, { ...options, headers: newHeaders });

        } catch (error) {
            console.error("Refresh token fallito o logout in corso.", error);
            authHelpers.logout(); // Il logout gestirà il reindirizzamento tramite lo stato
            return response;
        }
    }

    return response;
};

// --- Funzioni Helper Esportate ---

export const apiGet = (path: string) => authedFetch(path, { method: "GET" });

export const apiPost = (path: string, body: any) => authedFetch(path, { method: "POST", body: JSON.stringify(body) });

export const apiPatch = (path: string, body: any) => authedFetch(path, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = (path: string) => authedFetch(path, { method: "DELETE" });