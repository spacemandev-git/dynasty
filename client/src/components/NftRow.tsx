import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { RoundItem, TableCell } from "./RoundList";
import { NFTList, RoundResponse } from "../types";
import styled from "styled-components";
import { BLOCK_ACCOUNT_URL } from "../lib/graphql";

function ipfsLinkToHttpLink(ipfs: string) {
  const ipfsLinkChars = 7;
  const ipfsHash = ipfs.slice(ipfsLinkChars);
  const httpIpfsUrl = `https://ipfs.io/ipfs/` + ipfsHash;
  return httpIpfsUrl;
}

export const NftRow: React.FC<{ token: NFTList }> = ({ token }) => {
  const { isConnected } = useAccount();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      console.log(`fetching... ${token.uri}`);
      const data = await fetch(ipfsLinkToHttpLink(token.uri));
      const metadata = await data.json();
      const imageUrl = ipfsLinkToHttpLink(metadata.image);
      setImageUrl(imageUrl);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <RoundItem key={token.id}>
      <TableCell>{token.id}</TableCell>
      <TableCell>
        <a href={BLOCK_ACCOUNT_URL + `/${token.owner}`} target="_blank">
          {token.owner}
        </a>
      </TableCell>
      <TableCell>
        <a href={token.uri} target="_blank">
          Meta
        </a>
      </TableCell>
      <TableCell>
        {imageUrl ? <Image src={imageUrl} alt="" /> : <span>Loading...</span>}
      </TableCell>
    </RoundItem>
  );
};

const Image = styled.img`
  font-family: sans-serif;
  font-weight: 400;
  border-radius: 4px;
  padding: 5px;
  height: 150px;
  width: 150px;
  margin-bottom: 1rem;
  color: #aaa;
  margin-top: 1rem;
`;
