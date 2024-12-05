// src/socket.js
import { io } from 'socket.io-client';

const socket = io('https://offline-learning.onrender.com'); // Adjust the URL based on your backend server

export default socket;
