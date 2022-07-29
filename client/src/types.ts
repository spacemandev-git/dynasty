export interface ScoringInterface {
  configHash: string;
  timeScoreWeight: number;
  moveScoreWeight: number;
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
