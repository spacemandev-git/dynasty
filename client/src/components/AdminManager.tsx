import "../App.css";
import { useContractRead } from "wagmi";
import { useState } from "react";
import { ErrorBanner } from "./ErrorBanner";
import { abi } from "@dfdao/gp-registry/abi/Registry.json";
import { registry } from "@dfdao/gp-registry/deployment.json";
import { AdminRow } from "./AdminRow";
import { AddAdmin } from "./AddAdmin";
import { ethers } from "ethers";
import { RoundsContainer, TableHeader } from "./RoundList";

export const AdminManager: React.FC = () => {
  const [submissionError, setSubmissionError] = useState<string | undefined>(
    undefined
  );

  const {
    data: adminData,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: registry,
    contractInterface: abi,
    functionName: "getAllAdmins",
    watch: true,
  });
  if (!adminData || isLoading) return <div>Loading...</div>;
  if (adminData.length === 0) return <div>No admins found.</div>;
  if (isError) return <div>Couldn't load admins.</div>;

  return (
    <RoundsContainer>
      {submissionError && (
        <ErrorBanner>
          <span>{submissionError}</span>
        </ErrorBanner>
      )}
      <thead>
        <tr>
          <TableHeader>Address</TableHeader>
        </tr>
      </thead>
      <tbody>
        {adminData
          .filter((a) => a !== ethers.constants.AddressZero)
          .map((admin) => (
            <AdminRow admin={admin} />
          ))}
      </tbody>
      <div style={{ height: "16px" }} />
      <AddAdmin onError={(error) => setSubmissionError(error)} />
    </RoundsContainer>
  );
};
