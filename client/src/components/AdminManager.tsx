import "../App.css";
import styled from "styled-components";
import { useAccount, useSignMessage } from "wagmi";
import useSWR, { useSWRConfig } from "swr";
import { addAdmin, deleteAdmin, fetcher, getAdminID } from "../lib/network";
import { getAddAdminMessage, getDeleteAdminMessage } from "../constants";
import { useState } from "react";
import { ErrorBanner } from "./ErrorBanner";
import { TextInput } from "./NewRoundForm";

export const AdminManager: React.FC<Record<string, never>> = () => {
  const { mutate } = useSWRConfig();
  const { address, isConnected } = useAccount();
  const [submissionError, setSubmissionError] = useState<string | undefined>(
    undefined
  );
  const [newAdminAddress, setNewAdminAddress] = useState<string>("");
  const { signMessageAsync } = useSignMessage({
    message: getAddAdminMessage(address),
  });
  const { signMessageAsync: signDeleteAdminMessage } = useSignMessage({
    message: getDeleteAdminMessage(address),
  });
  const { data: adminData, error } = useSWR(
    "http://localhost:3000/whitelist",
    fetcher
  );
  if (!adminData) return <div>Loading...</div>;
  if (error) return <div>Couldn't load admins.</div>;

  return (
    <RoundsContainer>
      {submissionError && (
        <ErrorBanner>
          <span>{submissionError}</span>
        </ErrorBanner>
      )}
      <thead>
        <tr>
          <TableHeader>Admin Address</TableHeader>
        </tr>
      </thead>
      <tbody>
        {adminData.body.map((admin: { id: number; address: string }) => (
          <RoundItem>
            <TableCell>
              {admin.address}
              {admin.address === address && (
                <span style={{ fontWeight: 600 }}> (you)</span>
              )}
            </TableCell>
            <TableCell>
              <button
                onClick={async () => {
                  if (submissionError) setSubmissionError(undefined);
                  const adminId = await getAdminID(admin.address);
                  const signed = await signDeleteAdminMessage();
                  mutate(
                    `http://localhost:3000/whitelist/${adminId}`,
                    async () => {
                      const res = await deleteAdmin(adminId, address, signed);
                      const responseError = await res.text();
                      if (res.status !== 200 && res.status !== 201) {
                        setSubmissionError(responseError);
                      }
                    }
                  );
                }}
                disabled={!isConnected}
              >
                Revoke
              </button>
            </TableCell>
          </RoundItem>
        ))}
      </tbody>
      <div style={{ height: "16px" }} />
      <InputWithButtonContainer>
        <StyledInput
          placeholder="New admin address"
          onChange={(e) => setNewAdminAddress(e.target.value)}
          value={newAdminAddress}
        />
        <BlueButton
          style={{ position: "relative" }}
          onClick={async () => {
            if (submissionError) setSubmissionError(undefined);
            const signed = await signMessageAsync();
            mutate(`http://localhost:3000/whitelist`, async () => {
              const res = await addAdmin(newAdminAddress, address, signed);
              const responseError = await res.text();
              if (res.status !== 200 && res.status !== 201) {
                setSubmissionError(responseError);
              }
            });
          }}
          disabled={
            !isConnected ||
            newAdminAddress.length === 0 ||
            !newAdminAddress.startsWith("0x")
          }
        >
          Add admin
        </BlueButton>
      </InputWithButtonContainer>
    </RoundsContainer>
  );
};

const StyledInput = styled(TextInput)`
  display: flex;
  flex: 1;
`;

const InputWithButtonContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  gap: 16px;
  padding: 8px;
  border: 2px solid #e3cca0;
  position: relative;
`;

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

const BlueButton = styled.button`
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
