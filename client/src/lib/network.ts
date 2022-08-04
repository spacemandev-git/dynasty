import {
  getAddAdminMessage,
  getAddRoundMessage,
  getDeleteAdminMessage,
  getDeleteRoundMessage,
  getEditRoundMessage,
} from "../constants";
import { ScoringInterface } from "../types";

export const fetcher = (...args: any) => fetch(args).then((res) => res.json());

export const getRoundDiff = (oldRound: any, newRound: any) => {
  // iterate over all keys in the new round
  const diff: any = {};
  Object.keys(newRound).forEach((key: string) => {
    if (oldRound[key] !== newRound[key]) {
      // if the key is in the old round and the value is different, add it to the diff
      diff[key] = newRound[key];
    }
  });
  return diff;
};

export function generateKeyFromRound(round: ScoringInterface) {
	return `${round.configHash}-${round.startTime}-${round.endTime}`;
}

export const getAdminID = async (address: string): Promise<number> => {
  const searchParams = new URLSearchParams({
    address: address,
  });
  const selectedAdmin = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/whitelist?${searchParams}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const fetchedText = await selectedAdmin.text();
  const fetchedId = JSON.parse(fetchedText).body[0].id;
  return fetchedId;
};

export const deleteRound = async (
  roundId: string,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/round/${roundId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: getDeleteRoundMessage(address),
      signature: signature,
    }),
  });
  return res;
};

export const deleteAdmin = async (
  adminAddress: string,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/admins/${adminAddress}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: adminAddress,
      message: getDeleteAdminMessage(address),
      signature: signature,
    }),
  });
  return res;
};

export const addAdmin = async (
  adminAddress: string,
  signer: string | undefined,
  signature: string
) => {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/admins`, {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      signature: signature,
      message: getAddAdminMessage(signer),
      address: adminAddress,
    }),
  });
  return res;
};

export const addRound = async (
  round: ScoringInterface,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/rounds`, {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      signature: signature,
      message: getAddRoundMessage(address),
      description: round.description,
      startTime: round.startTime,
      endTime: round.endTime,
      winner: round.winner,
      configHash: round.configHash,
    }),
  });
  console.log(res)
  return res;
};

export const editRound = async (
  newRound: ScoringInterface,
  oldRound: ScoringInterface,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const roundId = generateKeyFromRound(oldRound);
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/rounds/${roundId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: getEditRoundMessage(address),
      signature: signature,
      ...newRound
    }),
  });
  return res;
};
