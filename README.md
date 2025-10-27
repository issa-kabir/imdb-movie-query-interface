# IMDB Movie Database Query Interface

A modern web application that allows users to query the IMDB Top 1000 movies dataset using natural language. The system converts natural language questions into SQL queries using AI and executes them against a DuckDB database running entirely in the browser.

## 🎯 Purpose

This project demonstrates:
- **Natural Language to SQL**: Convert user questions into executable SQL queries
- **Browser-based Analytics**: Run complex queries on large datasets without server dependencies
- **AI-Powered Query Generation**: Use Cloudflare Workers AI to intelligently parse user intent
- **Modern Web Architecture**: React frontend with WebAssembly-powered database

## 📁 Project Structure

```
├── frontend/                 # React web application
│   ├── src/
│   │   ├── components/      # UI components (headers, input, table view, etc.)
│   │   ├── hooks/           # useDuckDB hook for database operations
│   │   └── resources/       # IMDB dataset and schema definitions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── workers/                 # Cloudflare Workers backend
│   ├── compile-sql.js       # AI-powered SQL compilation service
│   └── wrangler.toml        # Cloudflare Workers configuration
└── scripts/                 # Data utilities and snippets
    ├── snippets.js          # Database schema context for AI
    └── upsert-snippets.js   # Schema management utilities
```

## 🚀 How It Works

1. **User Input**: Users type natural language questions about movies
2. **AI Processing**: Cloudflare Workers AI converts questions to SQL using schema context
3. **Query Execution**: DuckDB WASM executes SQL queries in the browser
4. **Results Display**: Interactive table shows query results with full dataset

## 🎬 Dataset

The application uses the **IMDB Top 1000 Movies** dataset containing:
- Movie titles, release years, and ratings
- Directors and cast information (up to 4 main stars)
- Genres, runtime, and content ratings
- Box office gross earnings and vote counts
- Plot overviews and Metacritic scores

## 🛠️ Setup and Installation

### Frontend (React App)

```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`

### Backend (Cloudflare Workers)

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Deploy the worker:
```bash
cd workers
wrangler deploy
```

3. **Configure Proxy Settings:**

   The frontend uses a proxy configuration in `package.json` to route API calls to the Cloudflare Worker:
   ```json
   "proxy": "https://compile-sql.issa-kabir98.workers.dev"
   ```

   **Options:**
   - **Use deployed worker**: Keep the current proxy URL (recommended for production)
   - **Use local development**: Change to `"proxy": "http://localhost:8787"` and run:
     ```bash
     cd workers
     wrangler dev
     ```
   - **Update to your worker**: Replace with your deployed worker URL after running `wrangler deploy`

## 💡 Example Queries

Try asking questions like:
- "Show me movies directed by Christopher Nolan"
- "What are the highest-rated movies from the 1990s?"
- "Find action movies with a rating above 8.5"
- "Which movies made the most money at the box office?"
- "Show me all movies starring Leonardo DiCaprio"

## 🔧 Technical Features

- **DuckDB WASM**: Complete SQL database running in browser
- **React 19**: Modern React with hooks for state management
- **Material-UI**: Clean, responsive component library
- **Cloudflare Workers AI**: Serverless AI for SQL generation
- **Real-time Query**: Instant results without page refreshes

## 🎨 Components Overview

- **Headers**: Application title and branding
- **UserInput**: Natural language query input field
- **MessageBody**: Chat-like interface showing query history
- **TableView**: Dynamic table for displaying query results
- **useDuckDB**: Custom hook managing database connection and queries

## 📊 Database Schema

The movies table includes these key columns:
- `Series_Title` - Movie title
- `Released_Year` - Release year
- `Certificate` - Content rating/certification
- `Runtime` - Duration in minutes
- `IMDB_Rating` - Rating (1-10 scale)
- `Overview` - Plot summary/description
- `Meta_score` - Metacritic score
- `Director` - Director name
- `Star1, Star2, Star3, Star4` - Main cast
- `No_of_Votes` - Number of user votes
- `Gross` - Box office earnings

## 🔒 Security Features

- SQL injection protection with query validation
- Whitelist-only SQL operations (SELECT queries only)
- Schema-aware query generation
- Input sanitization and error handling

## 📝 License

This project is part of a technical assessment submission and is intended for demonstration purposes.

---

**Note**: This application requires a modern browser with WebAssembly support for optimal performance.