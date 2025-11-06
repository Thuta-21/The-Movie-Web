import { Client, ID, TablesDB, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE;
const PJ_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const TB_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(PJ_ID);

const database = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TB_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });
    if (result.total > 0) {
      const row = result.rows[0];
      await database.updateRow({
        databaseId: DATABASE_ID,
        tableId: TB_ID,
        rowId: row.$id,
        data: {
          count: row.count + 1,
        },
      });
    } else {
      await database.createRow({
        databaseId: DATABASE_ID,
        tableId: TB_ID,
        rowId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        },
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};


export const getTrendingMovie = async () => {
  try {
    const result = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TB_ID,
      queries: [
        Query.limit(5),
        Query.orderDesc('count')
      ],
    })
    return result.rows;
  } catch(e) {
    console.log(e)
  }
}