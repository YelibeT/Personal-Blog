const API_URL = "http://localhost:8800/api";

let accessToken = null;

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

    accessToken = data.accessToken;

    return data;
};


export const refreshAccessToken = async () => {
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        accessToken = null;
        return false;
    }

    const data = await response.json();

    accessToken = data.accessToken;

    return true;
};


export const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    accessToken = null;
};


export const apiFetch = async (endpoint, options = {}) => {
    const makeRequest = () => {
        const headers = {
            ...(options.headers || {})
        };

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        return fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: "include"
        });
    };

    let response = await makeRequest();

    // Access token expired
    if (response.status === 401) {
        const refreshed = await refreshAccessToken();

        if (!refreshed) {
            throw new Error("Admin session expired");
        }

        response = await makeRequest();
    }

    return response;
};