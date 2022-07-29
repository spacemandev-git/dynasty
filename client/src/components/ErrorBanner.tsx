import React from "react";
import styled from "styled-components";

export const ErrorBanner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ErrorBannerContainer>{children}</ErrorBannerContainer>;
};

const ErrorBannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  background: #ffc46b;
  color: #a05419;
`;
