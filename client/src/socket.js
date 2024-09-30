// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust the URL based on your backend server

export default socket;
