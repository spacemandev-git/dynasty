import React, { useState } from "react";
import { Formik, useField, useFormikContext } from "formik";
import { DEFAULT_SCORING_CONFIG } from "../constants";
import styled from "styled-components";
import DateTimePicker from "react-datetime-picker";
import { useAccount, useContractWrite } from "wagmi";
import { configHashGraphQuery } from "../lib/graphql";
import { ErrorBanner } from "./ErrorBanner";
import { abi } from "@dfdao/dynasty/abi/Registry.json";
import { registry } from "@dfdao/dynasty/deployment.json";
import { RoundInterface } from "../types";

export const DateTimeField = ({ ...props }: any) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <Picker
      {...props}
      value={new Date(field.value)}
      onChange={(val) => {
        setFieldValue(field.name, val.getTime());
      }}
    />
  );
};

export const NewRoundForm: React.FC = () => {
  console.log(`registry address`, registry);
  const [submissionError, setSubmissionError] = useState<string | undefined>(
    undefined
  );
  const { isConnected } = useAccount();

  const { write: addRound } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: registry,
    contractInterface: abi,
    functionName: "addGrandPrix",
    onError: (error) => {
      setSubmissionError(error.message);
    },
  });

  return (
    <Formik
      initialValues={DEFAULT_SCORING_CONFIG}
      onSubmit={async (values: RoundInterface) => {
        addRound({
          recklesslySetUnpreparedArgs: [
            values.startTime,
            values.endTime,
            values.configHash,
            values.parentAddress,
            values.seasonId,
          ],
        });
      }}
      validate={async (values) => {
        const errors = {} as { [key: string]: string };

        // Validate configHash
        const configHashStartsWith0x = values.configHash.startsWith("0x");
        if (values.configHash.length == 66) {
          if (!configHashStartsWith0x) {
            errors["configHashPrefix"] = "Config hash must start with 0x";
          } else {
            const error = await configHashGraphQuery(values.configHash);
            if (error) {
              errors["configHashGraphQL"] =
                "Config hash doesn't exist on-chain.";
            }
          }
        } else {
          errors["configHash"] = "Config hash is required.";
        }

        // validate start and end times
        if (values.startTime > values.endTime) {
          errors["startTime"] = "Start time must be before end time.";
        }
        if (values.startTime === values.endTime) {
          errors["startEndEqual"] =
            "Start time and end time must be different.";
        }
        if (!values.seasonId) {
          errors["seasonId"] = "Season is required.";
        }
        if (!values.parentAddress) {
          errors["parentAddress"] = "Map address is required.";
        }
        if (!values.parentAddress.startsWith("0x")) {
          errors["parentAddressPrefix"] = "Map address must start with 0x";
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
          >
            <FormItem>
              <Label>Start Time</Label>
              <DateTimeField name="startTime" />
            </FormItem>
            <FormItem>
              <Label>End Time</Label>
              <DateTimeField name="endTime" />
            </FormItem>
          </div>
          <Label>Dates are in your current time zone.</Label>
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
            <Label>Map Address</Label>
            <TextInput
              type="text"
              id="parentAddress"
              name="parentAddress"
              value={formik.values.parentAddress}
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
            <button
              disabled={!isConnected || Object.keys(formik.errors).length > 0}
              className="btn"
              type="submit"
            >
              Submit new round
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
