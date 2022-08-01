import { ScoringInterface } from "./types";

export const DEFAULT_SCORING_CONFIG: ScoringInterface = {
  configHash: "",
  winner: undefined,
  startTime: new Date().getTime(),
  endTime: new Date().getTime(),
  description: "",
};

export const getAddRoundMessage = (address: string | undefined): string => {
  return `Adding new Grand Prix Round as ${address}`;
};

export const getDeleteRoundMessage = (address: string | undefined): string => {
  return `Deleting new Grand Prix Round as ${address}`;
};

export const getEditRoundMessage = (address: string | undefined): string => {
  return `Editing new Grand Prix Round as ${address}`;
};

export const getAddAdminMessage = (address: string | undefined): string => {
  return `Adding new Admin as ${address}`;
};

export const getDeleteAdminMessage = (address: string | undefined): string => {
  return `Deleting new Admin as ${address}`;
};
