import { useState } from "react";
import { researchQuery } from "../services/api";

export default function ResearchPage() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        // send query to backend, display response
        setLoading(true);
        setResponse("");
        const result = await researchQuery(query);
        setResponse(result);
        setLoading(false);
    }

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
            <h1>Mini Research Agent</h1>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask anything..."
                style={{ width: "100%", padding: 10, fontSize: 16 }}
            />
            <button
                onClick={handleSubmit}
                disabled={loading || !query}
                style={{ marginTop: 10, padding: "10px 20px", fontSize: 16 }}
            >
                {loading ? "Researching..." : "Search"}
            </button>
            {response && (
                <div style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
                    <h2>Response:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}
