import "../App.css";
import styled from "styled-components";
import { useContractRead } from "wagmi";
import { abi } from "@dfdao/gp-registry/abi/Registry.json";
import { registry } from "@dfdao/gp-registry/deployment.json";
import { ErrorBanner } from "./ErrorBanner";
import { constants, ethers, utils } from "ethers";
import { RoundRow } from "./RoundRow";
import { RoundResponse } from "../types";

export const RoundList: React.FC = () => {
  const {
    data: roundData,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: registry,
    contractInterface: abi,
    functionName: "getAllGrandPrix",
    watch: true,
  });

  if (!roundData || isLoading) return <div>Loading...</div>;
  if (
    roundData.filter((r) => r.parentAddress !== constants.AddressZero)
      .length === 0
  )
    return (
      <div
        style={{ fontFamily: "Menlo, monospace", textTransform: "uppercase" }}
      >
        No rounds found.
      </div>
    );
  if (isError) return <div>Couldn't load previous rounds.</div>;

  return (
    <RoundsContainer>
      <thead>
        <tr>
          <TableHeader>Name</TableHeader>
          <TableHeader>Start</TableHeader>
          <TableHeader>End</TableHeader>
          <TableHeader>Season</TableHeader>
        </tr>
      </thead>
      <tbody>
        {roundData
          .filter((r) => r.parentAddress !== ethers.constants.AddressZero)
          .map((round: RoundResponse, i: number) => (
            <RoundRow round={round} key={i} />
          ))}
      </tbody>
    </RoundsContainer>
  );
};

export const TableHeader = styled.th`
  font-family: "Menlo", "Inconsolata", monospace;
  text-transform: uppercase;
  font-weight: 400;
  color: rgb(100, 115, 120);
  margin-bottom: 1rem;
  text-align: left;
  padding: 8px 16px;
`;

export const RoundsContainer = styled.div`
  border-collapse: collapse;
  display: block;
  border-spacing: 0;
  font-size: 1rem;
  overflow-y: auto;
`;

export const RoundItem = styled.tr`
  border: 1px solid rgb(53, 71, 73);
  width: 100%;
  transition: all 0.2s ease;
  &:hover {
    background: rgb(32, 36, 37);
  }
`;

export const TableCell = styled.td`
  padding: 8px 16px;
  text-align: left;
`;
