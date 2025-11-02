import { cards } from "../../scripts/cards";

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// === Helper: embed text array ===
		async function embedTexts(texts) {
			const res = await env.AI.run(
				"@cf/baai/bge-large-en-v1.5",
				{ text: texts }
			);
			return res.data;
		}

		// === ROUTE: POST /index — builds vectors from the cards.js file ===
		if (request.method === "POST" && url.pathname === "/index") {
			let items = [];

			// KPI cards
			cards.kpi.forEach(c =>
				items.push({
					id: `kpi:${c.id}`,
					text: `${c.name}\n${c.description}\n${c.sql}`,
					metadata: { name: c.name, category: c.category, type: "kpi" }
				})
			);

			// Column notes
			cards.columnNotes.forEach(c =>
				items.push({
					id: `col:${c.column}`,
					text: `${c.column}\n${c.description}\n${c.businessContext}\n${c.searchTips}`,
					metadata: { column: c.column, type: "columnNotes" }
				})
			);

			// NL -> SQL examples
			cards.nlToSqlExamples.forEach(section =>
				section.examples.forEach((ex, i) =>
					items.push({
						id: `nl:${section.category}:${i}`,
						text: `${ex.question}\n${ex.sql}\n${ex.explanation}`,
						metadata: { category: section.category, type: "nlToSql" }
					})
				)
			);

			// Query templates
			cards.queryTemplates.forEach(t =>
				items.push({
					id: `qt:${t.name}`,
					text: `${t.name}\n${t.template}\n${t.description}`,
					metadata: { type: "template" }
				})
			);

			// === Batch embed + insert ===
			const batchSize = 64;
			for (let i = 0; i < items.length; i += batchSize) {
				const batch = items.slice(i, i + batchSize);
				const embeddings = await embedTexts(batch.map(b => b.text));

				await env.VECTORIZE_INDEX.upsert(
					batch.map((b, j) => ({
						id: b.id,
						values: embeddings[j],
						metadata: b.metadata
					}))
				);
			}

			return new Response(JSON.stringify({ done: true, count: items.length }));
		}

		// === ROUTE: POST /query {query:"text"} ===
		if (request.method === "POST" && url.pathname === "/query") {
			const body = await request.json();
			const query = body.query;
			const topK = body.topK || 5;

			const [embedding] = await embedTexts([query]);

			const results = await env.VECTORIZE_INDEX.query(embedding, {
				topK,
				returnMetadata: true
			});

			return new Response(JSON.stringify(results, null, 2));
		}

		return new Response("Ready ✅");
	}
};
