import {
  getAddAdminMessage,
  getAddRoundMessage,
  getDeleteAdminMessage,
  getDeleteRoundMessage,
  getEditRoundMessage,
} from "../constants";
import { ScoringInterface } from "../types";

export const fetcher = (...args: any) => fetch(args).then((res) => res.json());

export const deleteRound = async (
  roundConfigHash: string,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const res = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/rounds/${roundConfigHash}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: getDeleteRoundMessage(address),
        signature: signature,
      }),
    }
  );
  return res;
};

export const deleteAdmin = async (
  adminAddress: string,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const res = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/admins/${adminAddress}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: adminAddress,
        message: getDeleteAdminMessage(address),
        signature: signature,
      }),
    }
  );
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
  // console.log(res);
  return res;
};

export const editRound = async (
  newRound: ScoringInterface,
  address: string | undefined,
  signature: string
): Promise<Response> => {
  const res = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/rounds/${newRound.configHash}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: getEditRoundMessage(address),
        signature: signature,
        ...newRound,
      }),
    }
  );
  return res;
};
