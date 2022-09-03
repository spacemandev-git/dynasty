import React, { useState } from "react";
import styled from "styled-components";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { abi as RegistryAbi } from "@dfdao/dynasty/abi/Registry.json";
import { abi as NFTAbi } from "@dfdao/dynasty/abi/NFT.json";
import { registry, nft } from "@dfdao/dynasty/deployment.json";

import { TextInput } from "./NewRoundForm";

export const AddAdmin: React.FC<{
  nftContract: boolean;
  onError: (error: string) => void;
}> = ({ onError, nftContract }) => {
  const { isConnected, address } = useAccount();

  const [newAdminAddress, setNewAdminAddress] = useState<string>("");

  const { config } = usePrepareContractWrite({
    addressOrName: nftContract ? nft : registry,
    contractInterface: nftContract ? NFTAbi : RegistryAbi,
    functionName: "setAdmin",
    args: [newAdminAddress, true],
  });

  const { writeAsync: addAdminWrite } = useContractWrite({
    ...config,
    onError: (error) => onError(`adminWrite ${error.message}`),
  });

  return (
    <InputWithButtonContainer>
      <StyledInput
        placeholder="New admin address"
        onChange={(e) => setNewAdminAddress(e.target.value)}
        value={newAdminAddress}
      />
      <button
        style={{ position: "relative" }}
        onClick={async () => {
          await addAdminWrite?.();
          setNewAdminAddress("");
        }}
        className="btn"
        disabled={
          !isConnected ||
          newAdminAddress.length === 0 ||
          !newAdminAddress.startsWith("0x") ||
          !addAdminWrite
        }
      >
        Add admin
      </button>
    </InputWithButtonContainer>
  );
};

const StyledInput = styled(TextInput)`
  display: flex;
  flex: 1;
  color: #fff;
`;

const InputWithButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  border: 1px solid rgb(53, 71, 73);
  position: relative;
`;
