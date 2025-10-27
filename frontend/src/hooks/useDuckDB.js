import { useEffect, useState } from "react";
import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm";

let db;
const tableName = 'movies';

export const useDuckDB = (datasetUrl) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                // receive the bundles of files required to run duckdb in the browser
                // this is the compiled wasm code, the js and worker scripts
                // worker scripts are js scripts ran in background threads (not the same thread as the ui)
                const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
                // select bundle is a function that selects the files that will work with your browser
                const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
                // creates storage and an address for the main worker
                const worker_url = URL.createObjectURL(
                    new Blob([`importScripts("${bundle.mainWorker}");`], {
                        type: "text/javascript",
                    })
                );
                // creates the worker and logger required for an instance of duckdb
                const worker = new Worker(worker_url);
                const logger = new duckdb.ConsoleLogger();
                db = new duckdb.AsyncDuckDB(logger, worker);

                // loads the web assembly module into memory and configures it
                await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
                // revoke the object url now no longer needed
                URL.revokeObjectURL(worker_url);
                console.log("DuckDB-Wasm initialized successfully.");

                const arrayBuffer = await loadDataset(datasetUrl);

                await createTable(arrayBuffer);
                setLoading(false)

            } catch (error) {
                console.error("Error initializing DuckDB-Wasm:", error);
            }
        })();
    }, [datasetUrl]);
    return { loading };
};

const loadDataset = async (datasetUrl) => {
    try {
        const response = await fetch(datasetUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        console.log("File loaded successfully");
        return arrayBuffer;
    } catch (error) {
        console.error("Error loading the dataset to DuckDB-Wasm:", error);
    }
}

const createTable = async (arrayBuffer) => {
    try {
        const conn = await db.connect();
        console.log("Database connection established");

        const virtualFileName = '/imdb_top_1000.parquet';
        await db.registerFileBuffer(virtualFileName, new Uint8Array(arrayBuffer));
        const query = `CREATE TABLE ${tableName} AS FROM read_parquet('${virtualFileName}');`;
        await conn.query(query);

        await conn.close();

        return arrayBuffer;
    } catch (error) {
        console.error("Error crating a table in DuckDB-Wasm:", error);
    }
}

export const runQuery = async (query) => {
    const conn = await db.connect();
    const query2 = query;
    const result = await conn.query(query2);
    const tableSchema = result.schema.fields.map((field) => field.name);
    const tableRows = result.toArray();

    await conn.close();

    return { tableSchema, tableRows }
}