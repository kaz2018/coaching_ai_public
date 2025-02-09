import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import {
  fetchMessages,
  fetchProfile,
  talktovertex,
  sendMessage,
  deleteMessages,
} from "../services/api";
import { auth } from "../services/firebase";

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadprofile = async () => {
      try {
        const token = await user.getIdToken();
        const fetchedProfile = await fetchProfile(token);
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadprofile();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const token = await user.getIdToken();
        //const fetchedProfile = await fetchProfile(token);
        const fetchedMessages = await fetchMessages(token);
        //setProfile(fetchedProfile);
        setMessages(fetchedMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error loading messages:", error);
        setLoading(false);
      }
    };

    loadMessages();
  }, [user]);

  const handleSignOut = () => {
    auth.signOut();
  };

  const handleSendMessage = useCallback(
    async (message) => {
      try {
        const token = await user.getIdToken();
        await sendMessage(token, message);
        const newMessages = [
          ...messages,
          {
            describe: message,
            user_id: user.uid,
            speaker: "user",
            timestamp: Date.now(),
            email: user.email,
          },
        ];
        setMessages(newMessages);

        // console.log("Messages list", newMessages);
        const vertexAiResponse = await talktovertex(token, newMessages);
        setMessages((prev) => [
          ...prev,
          {
            describe: vertexAiResponse["response"],
            user_id: null,
            speaker: "model",
            timestamp: Date.now(),
            email: "vertex@example.com",
          },
        ]); //vertexからの応答をメッセージリストに表示する場合
      } catch (error) {
        console.error("Error sending message to Vertex AI:", error);
        setLoading(false);
      }
    },
    [messages]
  );

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    const deleteAllMessages = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        await deleteMessages(token);
        setMessages([]);
        setLoading(false);
      } catch (error) {
        console.error("Error deleting messages:", error);
      }
    };
    deleteAllMessages();
    setMessages([]);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid h-100 d-flex flex-column">
      <div className="row py-3 bg-dark">
        <div className="col d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Chat App</h4>
          <div className="d-flex align-items-center">
            <span className="me-3">{user.email}</span>
            {/* test_ニックネーム表示*/}
            <span className="me-3">
              {/* {user.profile && `ニックネーム: ${user.profile.nick_name}`} */}
              {profile && `ニックネーム: ${profile.nick_name}`}
            </span>
            {/* test_end*/}
            <button className="btn btn-outline-light" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="row flex-grow-1">
        <div className="col h-100 d-flex flex-column">
          <MessageList messages={messages} currentUser={user} />
          <MessageInput user={user} onSendMessage={handleSendMessage} />
          <div className="d-flex justify-content-center">
            <button className="btn btn-danger" onClick={handleDeleteClick}>
              会話を削除
            </button>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>確認</Modal.Title>
        </Modal.Header>
        <Modal.Body>本当に会話を削除しますか？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Chat;
