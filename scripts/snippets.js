export const snippets = [
    {
        id: "1",
        text: "The IMDB_Rating column measures movie quality on a 1–10 scale, with higher ratings indicating better movies. The top-rated movie in this dataset is The Shawshank Redemption with a 9.3 rating.",
        metadata: { tables: ["movies"], columns: ["IMDB_Rating"], dataTypes: ["DOUBLE"] }
    },
    {
        id: "2",
        text: "Released_Year contains the year the movie was released as a string. Movies in this dataset span from 1921 to 2020, covering nearly a century of cinema.",
        metadata: { tables: ["movies"], columns: ["Released_Year"], dataTypes: ["VARCHAR"] }
    },
    {
        id: "3",
        text: "Series_Title contains the full movie title. Examples include classics like 'The Godfather', 'Pulp Fiction', and modern hits like 'Joker'.",
        metadata: { tables: ["movies"], columns: ["Series_Title"], dataTypes: ["VARCHAR"] }
    },
    {
        id: "4",
        text: "Genre categorizes movies into types like Drama, Action, Comedy, Crime, etc. Many movies have multiple genres separated by commas.",
        metadata: { tables: ["movies"], columns: ["Genre"], dataTypes: ["VARCHAR"] }
    },
    {
        id: "5",
        text: "Director contains the name of the movie's director. Notable directors include Christopher Nolan, Steven Spielberg, and Martin Scorsese.",
        metadata: { tables: ["movies"], columns: ["Director"], dataTypes: ["VARCHAR"] }
    },
    {
        id: "6",
        text: "Star1, Star2, Star3, Star4 contain the main actors in the movie. Star1 is typically the lead actor or most prominent cast member.",
        metadata: { tables: ["movies"], columns: ["Star1", "Star2", "Star3", "Star4"], dataTypes: ["VARCHAR", "VARCHAR", "VARCHAR", "VARCHAR"] }
    },
    {
        id: "7",
        text: "No_of_Votes represents the number of IMDB users who rated the movie. Higher vote counts generally indicate more popular or well-known films.",
        metadata: { tables: ["movies"], columns: ["No_of_Votes"], dataTypes: ["BIGINT"] }
    },
    {
        id: "8",
        text: "Gross contains the worldwide box office earnings in US dollars as a string with commas. Not all movies have gross earnings data available.",
        metadata: { tables: ["movies"], columns: ["Gross"], dataTypes: ["VARCHAR"] }
    },
    {
        id: "9",
        text: "Meta_score is the Metacritic score (0-100) representing critical consensus. Higher scores indicate better critical reception.",
        metadata: { tables: ["movies"], columns: ["Meta_score"], dataTypes: ["BIGINT"] }
    },
    {
        id: "10",
        text: "Runtime shows the movie duration in minutes, formatted as 'XXX min'. Most movies in this dataset range from 90 to 200 minutes.",
        metadata: { tables: ["movies"], columns: ["Runtime"], dataTypes: ["VARCHAR"] }
    },
    {
        id: "11",
        text: "Certificate indicates the movie's age rating (U, UA, A, PG-13, R, etc.) which determines the appropriate audience.",
        metadata: { tables: ["movies"], columns: ["Certificate"], dataTypes: ["VARCHAR"] }
    },
    {
        id: "12",
        text: "Overview provides a brief plot summary or description of the movie's storyline and main themes.",
        metadata: { tables: ["movies"], columns: ["Overview"], dataTypes: ["VARCHAR"] }
    }
];
