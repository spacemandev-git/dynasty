import React, { useEffect, useState } from "react";
import { Formik, useField, useFormikContext } from "formik";
import { DEFAULT_NFT_CONFIG, DEFAULT_SCORING_CONFIG } from "../constants";
import styled from "styled-components";
import DateTimePicker from "react-datetime-picker";
import { useAccount, useContractWrite } from "wagmi";
import { BLOCK_EXPLORER_URL, configHashGraphQuery } from "../lib/graphql";
import { ErrorBanner } from "./ErrorBanner";
import { abi } from "@dfdao/dynasty/abi/NFT.json";
import { nft } from "@dfdao/dynasty/deployment.json";
import { MintInterface, RoundInterface } from "../types";
import { ImageUpload } from "./ImageUpload";
import { storeNFTMeta } from "../lib/nft";

export const NewNFT: React.FC = () => {
  const [submissionError, setSubmissionError] = useState<string | undefined>(
    undefined
  );

  const [image, setImage] = useState<Blob>();
  const [uri, setUri] = useState("");
  const [nftUri, setUploading] = useState(false);

  const { isConnected } = useAccount();

  const {
    data,
    isLoading,
    isSuccess: mintSuccess,
    write: mintTo,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: nft,
    contractInterface: abi,
    functionName: "mintTo",
    onError: (error) => {
      setSubmissionError(error.message);
    },
  });

  return (
    <Formik
      initialValues={DEFAULT_NFT_CONFIG}
      onSubmit={async (values: MintInterface) => {
        if (!image) {
          setSubmissionError("Image is required");
          throw new Error("Image is required");
        }

        setSubmissionError("");
        setUploading(true);
        // Also need to update metadata
        const uri = await storeNFTMeta(image, values);
        setUploading(false);
        mintTo({
          recklesslySetUnpreparedArgs: [values.playerAddress, uri],
        });
        setUri(uri);
      }}
      validate={async (values) => {
        const errors = {} as { [key: string]: string };

        // Validate configHash
        const configHashStartsWith0x = values.configHash.startsWith("0x");
        if (values.configHash.length == 66) {
          if (!configHashStartsWith0x) {
            errors["configHashPrefix"] = "Config hash must start with 0x";
          } else {
            // const error = await configHashGraphQuery(values.configHash);
            // if (error) {
            //   errors["configHashGraphQL"] =
            //     "Config hash doesn't exist on-chain.";
            // }
          }
        } else {
          errors["configHash"] = "Config hash is required.";
        }

        if (!values.seasonId) {
          errors["seasonId"] = "Season is required.";
        }
        if (!values.playerAddress) {
          errors["playerAddress"] = "Map address is required.";
        }
        if (!values.playerAddress.startsWith("0x")) {
          errors["playerAddressPrefix"] = "Map address must start with 0x";
        }
        return errors;
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              width: "100%",
            }}
          ></div>
          <FormItem>
            <Label>Config Hash</Label>
            <TextInput
              type="text"
              id="configHash"
              name="configHash"
              value={formik.values.configHash}
              onChange={formik.handleChange}
              placeholder="0xfe719a3cfccf2bcfa23f71f0af80a931eda4f4197331828d728b7505a6156930"
            />
          </FormItem>
          <FormItem>
            <Label>Player Address</Label>
            <TextInput
              type="text"
              id="playerAddress"
              name="playerAddress"
              value={formik.values.playerAddress}
              onChange={formik.handleChange}
              placeholder="0xb96f4057fc8d90d47f0265414865f998fe356da1"
            />
          </FormItem>
          <FormItem>
            <Label>Season</Label>
            <TextInput
              type="number"
              id="seasonId"
              name="seasonId"
              min="1"
              value={formik.values.seasonId}
              onChange={formik.handleChange}
              placeholder="1"
            />
          </FormItem>
          <FormItem>
            <Label>Image</Label>
            <ImageUpload setImage={(e: any) => setImage(e)} />
          </FormItem>
          <FormItem>
            <button
              disabled={!isConnected || Object.keys(formik.errors).length > 0}
              className="btn"
              type="submit"
            >
              Mint
            </button>
            {Object.keys(formik.errors).length > 0 && isConnected && (
              <ErrorBanner>
                {Object.values(formik.errors).map((error) => (
                  <span key={error}>🚫 {error}</span>
                ))}
              </ErrorBanner>
            )}
            {submissionError && isConnected && (
              <ErrorBanner>
                <span>🚫 {submissionError}</span>
              </ErrorBanner>
            )}
            {!isConnected && (
              <span>
                Connect wallet. Only a community admin can add/remove new
                rounds.
              </span>
            )}
            {nftUri && <span>Uploading metadata to IPFS...</span>}
            {isLoading && <span>Submitting transaction...</span>}
            {uri && mintSuccess && (
              <div>
                <a href={`${BLOCK_EXPLORER_URL}/${data?.hash}`} target="_blank">
                  Minted
                </a>{" "}
                NFT with{" "}
                <a href={uri} target="_blank">
                  metadata
                </a>
              </div>
            )}
          </FormItem>
        </Form>
      )}
    </Formik>
  );
};

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
`;

export const TextInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid rgb(53, 71, 73);
  border-radius: 2px;
  background: none;
  color: #fff;
  transition: border-color 0.2s ease-in-out;
  &:hover {
    border-color: rgba(45, 240, 159, 0.4);
  }
`;

const Label = styled.label`
  width: 100%;
  text-align: left;
  font-weight: 400;
  font-family: "Menlo", "Inconsolata", monospace;
  text-transform: uppercase;
  font-size: 0.8em;
  color: #aaa;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgb(53, 71, 73);
  background: rgb(32, 36, 37);
  border-radius: 6px;
  padding: 1rem;
  align-items: center;
  justify-content: center;
  width: 600px;
`;

const Picker = styled(DateTimePicker)`
  display: flex;
  align-items: flex-start;
  .react-datetime-picker__wrapper {
    flex-grow: 0;
    border-radius: 2px;
    border: 1px solid rgb(53, 71, 73);
    background: none;
    color: #fff;
    transition: border-color 0.2s ease-in-out;
    &:hover {
      border-color: rgba(45, 240, 159, 0.4);
    }
    .react-datetime-picker__inputGroup {
      padding: 0.5rem;
      color: #fff;
    }
    .react-datetime-picker__inputGroup__input {
      color: #fff;
    }
    .react-datetime-picker__button__icon {
      color: #fff;
      stroke: #fff;
    }
    .react-datetime-picker__clear-button {
      color: #fff;
    }
  }
  .react-calendar {
    border-radius: 4px;
    padding: 0.5rem;
  }
`;
