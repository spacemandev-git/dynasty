import "./App.css";
import styled from "styled-components";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RoundList } from "./components/RoundList";
import { NewRoundForm } from "./components/NewRoundForm";
import Modal from "react-modal";
import { useState } from "react";
import { ScoringInterface } from "./types";
import { AdminManager } from "./components/AdminManager";

Modal.setAppElement("#root");

function App() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingRound, setEditingRound] = useState<
    ScoringInterface | undefined
  >(undefined);
  return (
    <Container>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          setEditingRound(undefined);
        }}
        style={customModalStyles}
        contentLabel="Edit Round"
      >
        <Title>Edit Round Info</Title>
        <div style={{ height: "16px" }} />
        <NewRoundForm editCurrentRound={editingRound} />
      </Modal>
      <Nav>
        <Title>Dynasty Admin</Title>
        <ConnectButton />
      </Nav>
      <Title>Create new Round</Title>
      <NewRoundForm />
      <Title>All rounds</Title>
      <RoundList
        onEditRound={(round: ScoringInterface) => {
          setModalOpen(true);
          setEditingRound(round);
        }}
      />

      <Title>Manage Admins</Title>
      <AdminManager />
    </Container>
  );
}

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 1rem;
`;

const Title = styled.span`
  font-family: sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const Nav = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default App;
