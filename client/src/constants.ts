import { RoundInterface, MintInterface } from "./types";

export const DEV_DEFAULT_SCORING_CONFIG: RoundInterface = {
  configHash:
    "0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930",
  startTime: new Date().getTime(),
  endTime: new Date().getTime(),
  seasonId: 1,
  parentAddress: "0xb96f4057fc8d90d47f0265414865f998fe356da1",
};

export const DEV_DEFAULT_NFT_CONFIG: MintInterface = {
  configHash:
    "0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930",
  seasonId: 1,
  playerAddress: "0xb96f4057fc8d90d47f0265414865f998fe356da1",
};

export const DEFAULT_SCORING_CONFIG: RoundInterface = {
  configHash:"",
  startTime: new Date().getTime(),
  endTime: new Date().getTime() + (7 * 24 * 60 * 60 * 1000),
  seasonId: 1,
  parentAddress: "",
};

export const DEFAULT_NFT_CONFIG: MintInterface = {
  configHash:
    "",
  seasonId: 1,
  playerAddress: "",
};

