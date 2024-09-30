import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { url } from '../../url'; // Replace with your actual URL
import { useLocation } from 'react-router-dom';

const socket = io(url); // Connect to the Socket.io server

const Chat = () => {
  const location = useLocation();
  const { tutorId, learnerId } = location.state || {};
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessages, setNewMessages] = useState([]);

  console.log("Learner ID: " + learnerId + " | Tutor ID: " + tutorId);

  useEffect(() => {
    // Fetch previous chat history
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${url}/api/chats/${learnerId}/${tutorId}`);
        setChatHistory(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();

    // Listen for new messages
    socket.on('receiveMessage', (data) => {
      if ((data.senderId === learnerId && data.receiverId === tutorId) || 
          (data.senderId === tutorId && data.receiverId === learnerId)) {
        setNewMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [learnerId, tutorId]);

  const sendMessage = () => {
    if (message.trim()) {
      // Emit message to Socket.io server
      socket.emit('sendMessage', { senderId: learnerId, receiverId: tutorId, message });
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Chat History */}
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === learnerId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                msg.senderId === learnerId
                  ? 'bg-blue-500 rounded-br-none' // Learner's messages (right)
                  : 'bg-gray-500 rounded-bl-none' // Tutor's messages (left)
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}

        {/* New Messages */}
        {newMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === learnerId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                msg.senderId === learnerId
                  ? 'bg-blue-500 rounded-br-none' // Learner's messages (right)
                  : 'bg-gray-500 rounded-bl-none' // Tutor's messages (left)
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Area */}
      <div className="bg-white p-4 flex items-center border-t border-gray-200">
        <input
          type="text"
          className="input input-bordered flex-1 mr-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
