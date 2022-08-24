import { RoundInterface } from "./types";

export const DEFAULT_SCORING_CONFIG: RoundInterface = {
  configHash: "",
  startTime: new Date().getTime(),
  endTime: new Date().getTime(),
  seasonId: 1,
  parentAddress: "",
};
