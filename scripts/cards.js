// IMDB Top 1000 Movies Dataset - Analytics Cards
// Contains KPI recipes, column semantics, and NL -> SQL examples

export const cards = {

    // =============================================================================
    // KPI RECIPES - Key Performance Indicators for Movie Analytics
    // =============================================================================

    kpi: [
        {
            id: "avg_rating",
            name: "Average IMDB Rating",
            description: "Overall quality score across all movies",
            sql: "SELECT ROUND(AVG(IMDB_Rating), 2) as avg_rating FROM movies",
            format: "decimal",
            target: 8.0,
            category: "quality"
        },
        {
            id: "total_gross",
            name: "Total Box Office Revenue",
            description: "Combined worldwide gross earnings (movies with data)",
            sql: "SELECT ROUND(SUM(CAST(REPLACE(REPLACE(Gross, ',', ''), '$', '') AS BIGINT)) / 1000000, 0) as total_gross_millions FROM movies WHERE Gross IS NOT NULL AND Gross != ''",
            format: "currency_millions",
            category: "financial"
        },
        {
            id: "avg_runtime",
            name: "Average Movie Runtime",
            description: "Typical movie duration in minutes",
            sql: "SELECT ROUND(AVG(CAST(REPLACE(Runtime, ' min', '') AS INTEGER)), 0) as avg_runtime FROM movies WHERE Runtime IS NOT NULL",
            format: "minutes",
            category: "content"
        },
        {
            id: "top_rated_count",
            name: "Exceptional Movies (8.5+)",
            description: "Count of movies with rating 8.5 or higher",
            sql: "SELECT COUNT(*) as exceptional_count FROM movies WHERE IMDB_Rating >= 8.5",
            format: "integer",
            target: 50,
            category: "quality"
        },
        {
            id: "decade_diversity",
            name: "Decade Representation",
            description: "Number of different decades represented",
            sql: "SELECT COUNT(DISTINCT FLOOR(CAST(Released_Year AS INTEGER) / 10) * 10) as decades FROM movies WHERE Released_Year IS NOT NULL",
            format: "integer",
            category: "diversity"
        },
        {
            id: "director_productivity",
            name: "Most Prolific Director Count",
            description: "Maximum number of movies by any single director",
            sql: "SELECT MAX(movie_count) as max_movies FROM (SELECT Director, COUNT(*) as movie_count FROM movies WHERE Director IS NOT NULL GROUP BY Director)",
            format: "integer",
            category: "talent"
        }
    ],

    // =============================================================================
    // COLUMN SEMANTICS - Data definitions and business context
    // =============================================================================

    columnNotes: [
        {
            column: "Series_Title",
            dataType: "VARCHAR",
            description: "Official movie title as listed on IMDB",
            businessContext: "Primary identifier for movies. Includes international titles and alternate spellings.",
            examples: ["The Shawshank Redemption", "Il buono, il brutto, il cattivo", "Sen to Chihiro no kamikakushi"],
            searchTips: "Use ILIKE '%keyword%' for fuzzy matching of movie titles"
        },
        {
            column: "Released_Year",
            dataType: "VARCHAR",
            description: "Year the movie was released theatrically",
            businessContext: "Spans from 1921 to 2020, covering nearly a century of cinema history",
            dateSemantics: {
                format: "YYYY",
                range: "1921-2020",
                granularity: "year"
            },
            examples: ["1994", "2008", "1972"],
            searchTips: "Cast to INTEGER for numerical comparisons: CAST(Released_Year AS INTEGER)"
        },
        {
            column: "IMDB_Rating",
            dataType: "DOUBLE",
            description: "User rating on 1-10 scale from IMDB community",
            businessContext: "Higher ratings indicate better perceived quality. Top movies typically rate 8.5+",
            range: "1.0 - 10.0",
            examples: [9.3, 8.7, 7.4],
            qualityBands: {
                exceptional: "9.0+",
                excellent: "8.5-8.9",
                good: "7.5-8.4",
                average: "6.0-7.4",
                poor: "< 6.0"
            }
        },
        {
            column: "Genre",
            dataType: "VARCHAR",
            description: "Movie categories, often multiple genres separated by commas",
            businessContext: "Helps classify movie types for audience targeting and content analysis",
            examples: ["Drama", "Action, Adventure, Sci-Fi", "Comedy, Romance"],
            searchTips: "Use LIKE '%genre%' to find movies containing specific genres"
        },
        {
            column: "Director",
            dataType: "VARCHAR",
            description: "Primary director of the movie",
            businessContext: "Key creative talent indicator. Some directors have multiple films in top 1000",
            examples: ["Christopher Nolan", "Steven Spielberg", "Martin Scorsese"],
            searchTips: "Use ILIKE for case-insensitive director searches"
        },
        {
            column: "Runtime",
            dataType: "VARCHAR",
            description: "Movie duration formatted as 'XXX min'",
            businessContext: "Indicates movie length. Most films range 90-200 minutes",
            format: "XXX min",
            examples: ["142 min", "189 min", "96 min"],
            searchTips: "Extract minutes: CAST(REPLACE(Runtime, ' min', '') AS INTEGER)"
        },
        {
            column: "Gross",
            dataType: "VARCHAR",
            description: "Worldwide box office earnings in USD with comma separators",
            businessContext: "Financial success metric. Not all movies have gross data available",
            format: "XXX,XXX,XXX",
            examples: ["534,858,444", "28,341,469"],
            searchTips: "Remove commas for calculations: CAST(REPLACE(Gross, ',', '') AS BIGINT)",
            nullHandling: "Many movies have null/empty gross values"
        },
        {
            column: "Meta_score",
            dataType: "BIGINT",
            description: "Metacritic critic score (0-100 scale)",
            businessContext: "Professional critic consensus. Higher scores indicate critical acclaim",
            range: "0-100",
            examples: [94, 82, 66],
            qualityBands: {
                universal_acclaim: "81-100",
                generally_favorable: "61-80",
                mixed_average: "40-60",
                generally_unfavorable: "20-39",
                overwhelming_dislike: "0-19"
            }
        },
        {
            column: "No_of_Votes",
            dataType: "BIGINT",
            description: "Number of IMDB users who rated the movie",
            businessContext: "Popularity and awareness indicator. Higher vote counts suggest broader appeal",
            examples: [2343110, 1620367, 689845],
            searchTips: "Use for popularity analysis and statistical significance of ratings"
        },
        {
            column: "Certificate",
            dataType: "VARCHAR",
            description: "Age/content rating classification",
            businessContext: "Determines target audience and content appropriateness",
            examples: ["PG-13", "R", "U", "UA", "A"],
            categories: {
                "U": "Universal - suitable for all",
                "UA": "Parental guidance for under 12",
                "A": "Adults only",
                "PG-13": "Parents strongly cautioned",
                "R": "Restricted - under 17 requires adult"
            }
        }
    ],

    // =============================================================================
    // NATURAL LANGUAGE TO SQL EXAMPLES
    // =============================================================================

    nlToSqlExamples: [
        {
            category: "Basic Queries",
            examples: [
                {
                    question: "Show me the top 10 highest rated movies",
                    sql: "SELECT Series_Title, IMDB_Rating, Released_Year FROM movies ORDER BY IMDB_Rating DESC LIMIT 10",
                    explanation: "Orders movies by rating descending and limits to top 10"
                },
                {
                    question: "Find all movies directed by Christopher Nolan",
                    sql: "SELECT Series_Title, Released_Year, IMDB_Rating FROM movies WHERE Director ILIKE '%christopher nolan%'",
                    explanation: "Uses ILIKE for case-insensitive pattern matching"
                },
                {
                    question: "What movies were released in 1994?",
                    sql: "SELECT Series_Title, Director, IMDB_Rating FROM movies WHERE Released_Year = '1994'",
                    explanation: "Direct year comparison using string equality"
                }
            ]
        },
        {
            category: "Genre Analysis",
            examples: [
                {
                    question: "Show me all action movies with rating above 8.5",
                    sql: "SELECT Series_Title, IMDB_Rating, Genre FROM movies WHERE Genre ILIKE '%action%' AND IMDB_Rating > 8.5",
                    explanation: "Combines genre filtering with rating threshold"
                },
                {
                    question: "Find the best comedy movies",
                    sql: "SELECT Series_Title, IMDB_Rating, Released_Year FROM movies WHERE Genre ILIKE '%comedy%' ORDER BY IMDB_Rating DESC LIMIT 15",
                    explanation: "Filters by genre and sorts by rating"
                },
                {
                    question: "How many movies are there in each genre?",
                    sql: "SELECT Genre, COUNT(*) as movie_count FROM movies WHERE Genre IS NOT NULL GROUP BY Genre ORDER BY movie_count DESC",
                    explanation: "Groups by genre and counts occurrences"
                }
            ]
        },
        {
            category: "Time-based Analysis",
            examples: [
                {
                    question: "What were the best movies of the 1990s?",
                    sql: "SELECT Series_Title, Released_Year, IMDB_Rating FROM movies WHERE CAST(Released_Year AS INTEGER) BETWEEN 1990 AND 1999 ORDER BY IMDB_Rating DESC LIMIT 10",
                    explanation: "Filters by decade using integer casting and BETWEEN"
                },
                {
                    question: "Show me movies by decade with average ratings",
                    sql: "SELECT FLOOR(CAST(Released_Year AS INTEGER) / 10) * 10 as decade, ROUND(AVG(IMDB_Rating), 2) as avg_rating, COUNT(*) as movie_count FROM movies WHERE Released_Year IS NOT NULL GROUP BY decade ORDER BY decade",
                    explanation: "Groups movies into decades and calculates statistics"
                },
                {
                    question: "Find the oldest movie in the dataset",
                    sql: "SELECT Series_Title, Released_Year, Director FROM movies WHERE Released_Year IS NOT NULL ORDER BY CAST(Released_Year AS INTEGER) ASC LIMIT 1",
                    explanation: "Sorts by year ascending to find earliest"
                }
            ]
        },
        {
            category: "Financial Analysis",
            examples: [
                {
                    question: "Which movies made the most money?",
                    sql: "SELECT Series_Title, Gross, IMDB_Rating FROM movies WHERE Gross IS NOT NULL AND Gross != '' ORDER BY CAST(REPLACE(Gross, ',', '') AS BIGINT) DESC LIMIT 10",
                    explanation: "Removes commas and casts to number for proper sorting"
                },
                {
                    question: "What's the average box office for movies above 8.0 rating?",
                    sql: "SELECT ROUND(AVG(CAST(REPLACE(Gross, ',', '') AS BIGINT)) / 1000000, 2) as avg_gross_millions FROM movies WHERE IMDB_Rating > 8.0 AND Gross IS NOT NULL AND Gross != ''",
                    explanation: "Calculates average gross in millions for high-rated movies"
                },
                {
                    question: "Show movies that made over 500 million dollars",
                    sql: "SELECT Series_Title, Gross, IMDB_Rating, Released_Year FROM movies WHERE Gross IS NOT NULL AND CAST(REPLACE(Gross, ',', '') AS BIGINT) > 500000000",
                    explanation: "Filters by gross earnings threshold"
                }
            ]
        },
        {
            category: "Cast and Crew Analysis",
            examples: [
                {
                    question: "Find all movies starring Leonardo DiCaprio",
                    sql: "SELECT Series_Title, Released_Year, IMDB_Rating FROM movies WHERE Star1 ILIKE '%leonardo dicaprio%' OR Star2 ILIKE '%leonardo dicaprio%' OR Star3 ILIKE '%leonardo dicaprio%' OR Star4 ILIKE '%leonardo dicaprio%'",
                    explanation: "Searches across all four star columns"
                },
                {
                    question: "Which directors have the most movies in this list?",
                    sql: "SELECT Director, COUNT(*) as movie_count, ROUND(AVG(IMDB_Rating), 2) as avg_rating FROM movies WHERE Director IS NOT NULL GROUP BY Director HAVING COUNT(*) > 1 ORDER BY movie_count DESC",
                    explanation: "Groups by director, filters for multiple movies, shows stats"
                },
                {
                    question: "Show me Tom Hanks movies sorted by rating",
                    sql: "SELECT Series_Title, Released_Year, IMDB_Rating FROM movies WHERE Star1 ILIKE '%tom hanks%' OR Star2 ILIKE '%tom hanks%' OR Star3 ILIKE '%tom hanks%' OR Star4 ILIKE '%tom hanks%' ORDER BY IMDB_Rating DESC",
                    explanation: "Finds actor across star columns and sorts by rating"
                }
            ]
        },
        {
            category: "Content Analysis",
            examples: [
                {
                    question: "What are the longest movies?",
                    sql: "SELECT Series_Title, Runtime, IMDB_Rating FROM movies WHERE Runtime IS NOT NULL ORDER BY CAST(REPLACE(Runtime, ' min', '') AS INTEGER) DESC LIMIT 10",
                    explanation: "Extracts minutes from runtime string and sorts"
                },
                {
                    question: "Find short movies under 100 minutes with high ratings",
                    sql: "SELECT Series_Title, Runtime, IMDB_Rating FROM movies WHERE Runtime IS NOT NULL AND CAST(REPLACE(Runtime, ' min', '') AS INTEGER) < 100 AND IMDB_Rating > 8.0",
                    explanation: "Combines runtime and rating filters"
                },
                {
                    question: "Show me movies by content rating",
                    sql: "SELECT Certificate, COUNT(*) as movie_count, ROUND(AVG(IMDB_Rating), 2) as avg_rating FROM movies WHERE Certificate IS NOT NULL AND Certificate != '' GROUP BY Certificate ORDER BY movie_count DESC",
                    explanation: "Groups by certificate/rating and shows distribution"
                }
            ]
        },
        {
            category: "Advanced Analytics",
            examples: [
                {
                    question: "Which decade had the best movies on average?",
                    sql: "SELECT FLOOR(CAST(Released_Year AS INTEGER) / 10) * 10 as decade, ROUND(AVG(IMDB_Rating), 2) as avg_rating, COUNT(*) as movie_count FROM movies WHERE Released_Year IS NOT NULL GROUP BY decade HAVING COUNT(*) >= 5 ORDER BY avg_rating DESC",
                    explanation: "Statistical analysis by decade with minimum sample size"
                },
                {
                    question: "Find underrated gems with high critic scores but lower popularity",
                    sql: "SELECT Series_Title, IMDB_Rating, Meta_score, No_of_Votes FROM movies WHERE Meta_score > 80 AND No_of_Votes < 100000 AND IMDB_Rating > 8.0 ORDER BY Meta_score DESC",
                    explanation: "Identifies critically acclaimed but less popular movies"
                },
                {
                    question: "Show box office performance vs critical reception correlation",
                    sql: "SELECT Series_Title, CAST(REPLACE(Gross, ',', '') AS BIGINT) as gross_earnings, IMDB_Rating, Meta_score FROM movies WHERE Gross IS NOT NULL AND Gross != '' AND Meta_score IS NOT NULL ORDER BY gross_earnings DESC",
                    explanation: "Compares financial and critical success metrics"
                }
            ]
        }
    ],

    // =============================================================================
    // QUERY TEMPLATES - Reusable patterns for common analysis
    // =============================================================================

    queryTemplates: [
        {
            name: "Top N by Metric",
            template: "SELECT {columns} FROM movies WHERE {filters} ORDER BY {metric} DESC LIMIT {n}",
            description: "Find top performers by any metric"
        },
        {
            name: "Genre Analysis",
            template: "SELECT {aggregates} FROM movies WHERE Genre ILIKE '%{genre}%' AND {filters} GROUP BY {group_by}",
            description: "Analyze movies within specific genres"
        },
        {
            name: "Time Series Analysis",
            template: "SELECT CAST(Released_Year AS INTEGER) as year, {aggregates} FROM movies WHERE Released_Year IS NOT NULL AND {filters} GROUP BY year ORDER BY year",
            description: "Trend analysis over time"
        },
        {
            name: "Cast/Crew Search",
            template: "SELECT {columns} FROM movies WHERE (Star1 ILIKE '%{person}%' OR Star2 ILIKE '%{person}%' OR Star3 ILIKE '%{person}%' OR Star4 ILIKE '%{person}%' OR Director ILIKE '%{person}%') AND {filters}",
            description: "Find movies by cast or crew member"
        }
    ]
};
