import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/StaffContact.css";

const StaffContact = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("https://vgfit-backend.onrender.com/api/messages");
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`https://vgfit-backend.onrender.com/api/messages/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="staff-messages-container">
      <h2>Customer Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="message-list">
          {messages.map((msg) => (
            <li key={msg._id} className="message-card">
              <p>
                <strong>Name:</strong> {msg.name}
              </p>
              <p>
                <strong>Phone:</strong> {msg.phone}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              <button
                onClick={() => deleteMessage(msg._id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StaffContact;
