const API_URL = "http://localhost:5000";

let jwtToken: string | null = localStorage.getItem("jwtToken");
let jwtExpire: number | null = null;

/** --- JWT Login --- */
export async function GetJwt(personId: string, password: string): Promise<string> {
    const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, password })
    });

    const text = await response.text(); // קוראים פעם אחת בלבד

    if (!response.ok) {
        throw new Error(text);
    }

    let token: string;

    try {
        const data = JSON.parse(text);
        token = data.token ?? "";
    } catch {
        // אם השרת מחזיר JWT כטקסט רגיל
        token = text;
    }

    if (!token) throw new Error("JWT לא התקבל מהשרת");

    jwtToken = token;
    localStorage.setItem("jwtToken", token);

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        jwtExpire = payload.exp * 1000;
    } catch {
        jwtExpire = null;
    }

    return token;
}
function isJwtValid(): boolean {
    return !!jwtToken && !!jwtExpire && Date.now() < jwtExpire;
}

/** --- Call API WITH JWT --- */
export async function CallService(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    parameters?: any
): Promise<any> {

    if (!isJwtValid()) {
        throw new Error("JWT missing or expired. Call GetJwt first.");
    }

    let fullUrl = `${API_URL}${url}`;

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
        }
    };
    if ((method === "POST" || method === "PUT") && parameters) {
        if (parameters instanceof FormData) {
            options.body = parameters;
            delete (options.headers as any)["Content-Type"];
        } else {
            options.body = JSON.stringify(parameters);
        }
    }


    if (method === "GET" && parameters) {
        fullUrl = `${fullUrl}?${new URLSearchParams(parameters).toString()}`;
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

/** --- Call API WITHOUT JWT --- */
export async function CallServiceOpen(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    parameters?: any
): Promise<any> {

    let fullUrl = `${API_URL}${url}`;

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if ((method === "POST" || method === "PUT") && parameters) {
        options.body = JSON.stringify(parameters);
    }

    if (method === "GET" && parameters) {
        fullUrl = `${fullUrl}?${new URLSearchParams(parameters).toString()}`;
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}