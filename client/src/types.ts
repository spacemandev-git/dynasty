export interface ScoringInterface {
  configHash: string;
  description: string;
  winner: string | undefined;
  startTime: number;
  endTime: number;
}

export type ValidationErrorType =
  | "configHashRequired"
  | "configHashInvalid"
  | "configHashNotFound"
  | "startTimeAfterEndTime"
  | "timeOverlaps";

export type ServerErrorType = "genericServerError";
