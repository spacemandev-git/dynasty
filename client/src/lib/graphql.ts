import { createClient } from "urql";

export const GRAPHQL_URL = import.meta.env.VITE_GRAPH_URL;
export const BLOCK_EXPLORER_URL = import.meta.env.VITE_BLOCK_EXPLORER_URL;
export const BLOCK_ACCOUNT_URL = import.meta.env.VITE_BLOCK_ACCOUNT_URL;

const client = createClient({
  url: GRAPHQL_URL,
});

export const getConfigsFromGraph = async (configHash: string) => {
  const configQuery = `
	query {
		arenas (orderBy:creationTime, orderDirection:desc, where:{configHash:"${configHash}"} ) {
			configHash
			creator
			lobbyAddress
			startTime
		}
	}
    `;
  return await client.query(configQuery).toPromise();
};

export async function configHashGraphQuery(configHash: string) {
  const x = await getConfigsFromGraph(configHash);
  if (!x.data) return "configHashNotFound";
  if (x.data?.arenas.length === 0) return "configHashNotFound";
}
