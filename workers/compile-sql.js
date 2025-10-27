import { Schema } from "../frontend/src/resources/schema";
import { snippets as snips } from "../scripts/snippets";

// workers/compile-sql.js
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname !== "/compile-sql") {
            return new Response("Not Found", { status: 404 });
        }
        if (request.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        const schema = Schema;
        const snippets = snips;

        try {
            const question = url.searchParams.get("question");
            if (!question || !schema) {
                return new Response(JSON.stringify({ error: "Missing question or schema" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                });
            }

            // Build a strict, helpful prompt
            const systemPrompt = `
            You are a SQL compiler for DuckDB. Return ONLY JSON of the form:
            { "sql": "<SELECT statement>", "reason": "<very short justification>" }

            Context:
            - Schema (truth source): ${JSON.stringify(schema, null, 2)}
            - Table name is movies
            - Helpful snippets (may be empty):
            ${snippets.map(s => `  - ${s.text}`).join("\n")}

            Rules:
            - Output must be a single SELECT query (no CTEs are fine, but still only SELECT).
            - ABSOLUTELY NO DDL/DML (no DROP/DELETE/UPDATE/INSERT/ALTER/CREATE).
            - Get every field unless requested otherwise by the user.
            - Use table/column names exactly as in schema.
            - Beware of the data types and if the user asks for something that doesn't have integer or BIGINT then give them the next closest one instead.
                • Example: when it comes to gross it is in VARCHAR but can be converted as int such as -> CAST(REPLACE(gross, ',', '') 
            - For text or name-based fields (e.g., Title, Name, City, Description):
                • When the user mentions a possible value that may not exactly match, use a case-insensitive pattern match: "column ILIKE '%value%'" (DuckDB supports ILIKE).
                • Example: user asks for "movies with godfather" -> WHERE title ILIKE '%godfather%'
                • Example: user asks for "director named Tom" -> WHERE director ILIKE '%tom%'
            - For numeric columns, match with comparison operators (=, >, <, BETWEEN) as appropriate.
            - If a user-provided name is partial or ambiguous, prefer a flexible substring match (ILIKE) instead of exact equality.
            - If ambiguous, choose the most reasonable and simple interpretation.
            - Always ensure the SQL is valid DuckDB syntax.
                  `.trim();

            // Call Cloudflare Workers AI (simple option)
            // You can switch models later; this one is good enough to start.
            const ai = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ]
            });

            let parsed;
            try {
                // If the model returned raw JSON text, parse it; otherwise try to parse from ai.response
                parsed = typeof ai === "object" && ai.sql ? ai : JSON.parse(ai.response ?? "{}");
            } catch {
                // Last resort: very naive extraction of SQL between backticks
                const m = /{[\s\S]*}/.exec(ai.response ?? "");
                parsed = m ? JSON.parse(m[0]) : {};
            }

            const sql = (parsed?.sql || "").trim();
            const reason = (parsed?.reason || "").trim();

            // Guardrails: block dangerous tokens
            const upper = sql.toUpperCase();
            const banned = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "CREATE"];
            if (!sql || banned.some(tok => upper.includes(tok))) {
                return new Response(
                    JSON.stringify({ error: "Unsafe or empty SQL generated. Try rephrasing your question." }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }

            return new Response(JSON.stringify({ sql, reason }), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            return new Response(
                JSON.stringify({ error: "Failed to compile SQL", details: String(err?.message || err) }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    },
};
