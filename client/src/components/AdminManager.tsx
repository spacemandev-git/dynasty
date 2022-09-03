import "../App.css";
import { useContractRead } from "wagmi";
import { useState } from "react";
import { ErrorBanner } from "./ErrorBanner";
import { abi as RegistryAbi } from "@dfdao/dynasty/abi/Registry.json";
import { abi as NFTAbi } from "@dfdao/dynasty/abi/NFT.json";
import { registry, nft } from "@dfdao/dynasty/deployment.json";
import { AdminRow } from "./AdminRow";
import { AddAdmin } from "./AddAdmin";
import { ethers } from "ethers";
import { RoundsContainer, TableHeader } from "./RoundList";

export const AdminManager: React.FC<{ nftContract: boolean }> = ({
  nftContract,
}) => {
  const [submissionError, setSubmissionError] = useState<string | undefined>(
    undefined
  );

  const {
    data: adminData,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: nftContract ? nft : registry,
    contractInterface: nftContract ? NFTAbi : RegistryAbi,
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
        <tbody>
          <tr>
            <TableHeader>Address</TableHeader>
          </tr>
        </tbody>
      </thead>
      <tbody>
        {adminData
          .filter((a) => a !== ethers.constants.AddressZero)
          .map((admin) => (
            <AdminRow key={admin} admin={admin} />
          ))}
      </tbody>
      <div style={{ height: "16px" }} />
      <AddAdmin
        nftContract={nftContract}
        onError={(error) => setSubmissionError(error)}
      />
    </RoundsContainer>
  );
};
