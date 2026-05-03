const API_URL = "http://localhost:8000";

export async function researchQuery(query: string): Promise<string> {
    // hit POST /research, return response string
    const res = await fetch(`${API_URL}/research`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
    });
    const data = await res.json();
    return data.response;
}

