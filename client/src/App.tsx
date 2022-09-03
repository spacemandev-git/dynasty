import "./App.css";
import styled from "styled-components";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RoundList } from "./components/RoundList";
import { NewRoundForm } from "./components/NewRoundForm";
import { AdminManager } from "./components/AdminManager";
import { useEffect, useState } from "react";
import { NewNFT } from "./components/NewNftForm";
import { ListNFT } from "./components/ListNFT";

function NewGrandPrix() {
  return (
    <>
      <Title>Create new Round</Title>
      <NewRoundForm />
      <div style={{ height: "2rem" }} />
      <Title>All rounds</Title>
      <RoundList />
      <div style={{ height: "2rem" }} />
      <Title>Manage Admins</Title>
      <AdminManager nftContract={false} />
    </>
  );
}

function MintNFT() {
  return (
    <>
      <Title>Mint Reward</Title>
      <NewNFT />
      <Title>Reward History</Title>
      <ListNFT />
      <Title>Manage Mint Admins</Title>
      <AdminManager nftContract={true} />
    </>
  );
}

function App() {
  const [mint, setMint] = useState(false);

  return (
    <Container>
      <Nav>
        <Logo>Dynasty Admin</Logo>
        <ConnectButton />
      </Nav>
      <Button onClick={() => setMint(!mint)}>
        {mint ? "Create Round" : "Mint NFT"}
      </Button>
      {mint ? <MintNFT /> : <NewGrandPrix />}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 1rem;
`;

const Button = styled.button`
  flex-direction: column;
  align-items: center;
  font-family: "Menlo", "Inconsolata", monospace;
  margin: 1rem;
`;

const Title = styled.span`
  font-family: sans-serif;
  font-weight: 400;
  margin-bottom: 1rem;
  color: #aaa;
  margin-top: 1rem;
`;

const Logo = styled(Title)`
  font-family: "Menlo", "Inconsolata", monospace;
  text-transform: uppercase;
  color: rgba(45, 240, 159, 1);
`;

const Nav = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default App;
