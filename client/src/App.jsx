// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';

import Chat from './components/Chat/Chat';
import TutorsList from './components/TutorsList/TutorsList';

import SwipedLearnersList from './components/TutorDashboard/SwipedLearnersList';
const App = () => {
  return (
    <Router>
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/learners/tutors" element={<TutorsList/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
         
  
          <Route path="/chat/:chatId" element={<Chat />} />
         <Route path="/tutor-dashboard" element={<SwipedLearnersList/>}/>
         <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
