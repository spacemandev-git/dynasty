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

export const getURLSearchParmsForRound = (
  round: ScoringInterface
): URLSearchParams => {
  return new URLSearchParams({
    endTime: round.endTime.toString(),
    startTime: round.startTime.toString(),
    configHash: round.configHash.toString(),
    description: round.description,
  });
};
export const getRoundID = async (round: ScoringInterface): Promise<number> => {
  const searchParams = getURLSearchParmsForRound(round);
  const selectedRoundID = await fetch(
    `http://localhost:3000/rounds?${searchParams}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const fetchedText = await selectedRoundID.text();
  const fetchedId = JSON.parse(fetchedText).body[0].id;
  return fetchedId;
};

export const getAdminID = async (address: string): Promise<number> => {
  const searchParams = new URLSearchParams({
    address: address,
  });
  const selectedAdmin = await fetch(
    `http://localhost:3000/whitelist?${searchParams}`,
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
  roundId: number,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const res = await fetch(`http://localhost:3000/rounds/${roundId}`, {
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
  adminId: number,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const res = await fetch(`http://localhost:3000/whitelist/${adminId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
  const res = await fetch(`http://localhost:3000/whitelist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  const res = await fetch(`http://localhost:3000/rounds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  return res;
};

export const editRound = async (
  newRound: ScoringInterface,
  oldRound: ScoringInterface,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const roundId = await getRoundID(oldRound);
  const params = getURLSearchParmsForRound(newRound);
  const roundDiff = getRoundDiff(oldRound, newRound);
  const res = await fetch(`http://localhost:3000/rounds/${roundId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: getEditRoundMessage(address),
      signature: signature,
      ...roundDiff,
    }),
  });
  return res;
};
