import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { url } from '../../url'; // Replace with your actual URL
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(url); // Connect to the Socket.io server

const Chat = () => {
  const location = useLocation();
  console.log(location);
  const { tutorId, learnerId, name, photo } = location.state || {};

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessages, setNewMessages] = useState([]);

  const notificationSound = new Audio('/hero.wav'); // Path to your notification sound

  const [id, setId] = useState(tutorId);
  const [naam, setNaam] = useState('');
  const [pic, setPic] = useState('');

  useEffect(() => {
    // Fetch previous chat history
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${url}/api/chats/${learnerId}/${tutorId}`);
        setChatHistory(response.data);
        const res = await axios.get(`${url}/api/users/${id}`);
        setNaam(res.data.name);
        setPic(res.data.photo);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();

    // Listen for new messages
    socket.on('receiveMessage', (data) => {
      if (
        (data.senderId === learnerId && data.receiverId === tutorId) ||
        (data.senderId === tutorId && data.receiverId === learnerId)
      ) {
        setNewMessages((prev) => [...prev, data]);
        notificationSound.play(); // Play sound on receiving a message
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
      toast.success('Message sent!');
      notificationSound.play(); // Play sound on sending a message
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      <ToastContainer /> {/* Add ToastContainer to show notifications */}

      {/* Chat Header */}
      <div className="flex items-center p-4 bg-black bg-opacity-50 text-white shadow-md">
        <img
          src={pic || 'https://via.placeholder.com/40'} // Default placeholder
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <h1 className="text-lg font-semibold">{naam || 'Chat User'}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white bg-opacity-80 rounded-lg mx-4 my-4 shadow-lg">
        {/* Chat History */}
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === learnerId ? 'justify-end' : 'justify-start'}`}
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
            className={`flex ${msg.senderId === learnerId ? 'justify-end' : 'justify-start'}`}
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
      <div className="bg-white p-4 flex items-center border-t border-gray-200 shadow-lg mx-4 my-4 rounded-lg">
        <input
          type="text"
          className="input input-bordered flex-1 mr-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
