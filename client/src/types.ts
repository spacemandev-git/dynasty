import { BigNumber } from "ethers";

export interface RoundInterface {
  startTime: number;
  endTime: number;
  configHash: string;
  parentAddress: string;
  seasonId: number;
}

export interface RoundResponse {
  configHash: string;
  startTime: BigNumber;
  endTime: BigNumber;
  parentAddress: string;
  seasonId: BigNumber;
}

export interface MintInterface {
  configHash: string;
  playerAddress: string;
  seasonId: number;
}

export interface NFTList {
  id: number;
  uri: string;
  owner: string;
}
