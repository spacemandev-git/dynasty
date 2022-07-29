import { createClient } from "urql";

const GRAPHQL_URL =
  "https://9a46-143-244-168-87.ngrok.io/subgraphs/name/df-arena-v2";

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
  let x = await getConfigsFromGraph(configHash);
  if (!x.data) return "configHashNotFound";
  if (x.data?.arenas.length === 0) return "configHashNotFound";
}
