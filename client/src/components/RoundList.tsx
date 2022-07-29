import "../App.css";
import styled from "styled-components";
import { getConfigName } from "../lib/getConfigName";
import { formatStartTime } from "../lib/date";
import { ScoringInterface } from "../types";
import { useAccount, useSignMessage } from "wagmi";
import useSWR, { useSWRConfig } from "swr";
import { deleteRound, fetcher, getRoundID } from "../lib/network";
import { getDeleteRoundMessage } from "../constants";
import { useState } from "react";
import { ErrorBanner } from "./ErrorBanner";

export const RoundList: React.FC<{
  onEditRound: (round: ScoringInterface) => void;
}> = ({ onEditRound }) => {
  const { mutate } = useSWRConfig();
  const { address, isConnected } = useAccount();
  const [submissionError, setSubmissionError] = useState<string | undefined>(
    undefined
  );
  const { signMessageAsync } = useSignMessage({
    message: getDeleteRoundMessage(address),
  });
  const { data: serverData, error } = useSWR(
    "http://localhost:3000/rounds",
    fetcher
  );
  if (!serverData) return <div>Loading...</div>;
  if (error) return <div>Couldn't load previous rounds.</div>;

  return (
    <RoundsContainer>
      {submissionError && (
        <ErrorBanner>
          <span>{submissionError}</span>
        </ErrorBanner>
      )}
      <thead>
        <tr>
          <TableHeader>Name</TableHeader>
          <TableHeader>Start</TableHeader>
          <TableHeader>End</TableHeader>
          <TableHeader>TimeWeight</TableHeader>
          <TableHeader>MoveWeight</TableHeader>
          <TableHeader>Winner</TableHeader>
        </tr>
      </thead>
      <tbody>
        {serverData.body.map((round: ScoringInterface) => (
          <RoundItem>
            <TableCell>{getConfigName(round.configHash)}</TableCell>
            <TableCell>{formatStartTime(round.startTime)}</TableCell>
            <TableCell>{formatStartTime(round.endTime)}</TableCell>
            <TableCell>{round.timeScoreWeight}</TableCell>
            <TableCell>{round.moveScoreWeight}</TableCell>
            <TableCell>
              {round.winner && round.winner.length > 0 ? round.winner : "None"}
            </TableCell>
            <TableCell>
              <MutedButton onClick={() => onEditRound(round)}>Edit</MutedButton>
            </TableCell>
            <TableCell>
              <button
                onClick={async () => {
                  if (submissionError) setSubmissionError(undefined);
                  const roundId = await getRoundID(round);
                  const signed = await signMessageAsync();
                  mutate(
                    `http://localhost:3000/rounds/${roundId}`,
                    async () => {
                      const res = await deleteRound(roundId, address, signed);
                      const responseError = await res.text();
                      if (res.status !== 200 && res.status !== 201) {
                        setSubmissionError(responseError);
                      }
                    }
                  );
                }}
                disabled={!isConnected}
              >
                Delete
              </button>
            </TableCell>
          </RoundItem>
        ))}
      </tbody>
    </RoundsContainer>
  );
};

const TableHeader = styled.th``;

const RoundsContainer = styled.div`
  border-collapse: collapse;
  display: block;
  border-spacing: 0;
  font-size: 1rem;
  overflow-y: auto;
`;

const RoundItem = styled.tr`
  border: 2px solid #e3cca0;
  width: 100%;
  transition: all 0.2s ease;
  &:hover {
    background: #ead7b0;
  }
`;

const TableCell = styled.td`
  padding: 8px 16px;
`;

const MutedButton = styled.button`
  background: #61c6ff;
  border: none;
  color: #0f5a9f;
  border: 2px solid rgba(15, 90, 159);
  &:disabled {
    background: rgba(97, 198, 255, 0.4);
    border-color: rgba(15, 90, 159, 0.4);
    color: rgba(15, 90, 159, 0.4);
  }
`;
