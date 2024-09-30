// src/components/Swiping/Swiping.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../../url';
const Swiping = () => {
  const [tutors, setTutors] = useState([]);

  const fetchTutors = async () => {
    try {
      const response = await axios.get(`${url}/api/tutors`); // Adjust the endpoint accordingly
      setTutors(response.data.tutors);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  };

  const handleSwipe = async (tutorId) => {
    try {
      await axios.post(`/api/users/swipe/${tutorId}`);
      alert('Swiped successfully!');
    } catch (error) {
      console.error('Swipe error:', error);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div>
      <h1>Tutors</h1>
      <div className="flex flex-col space-y-4">
        {tutors.map((tutor) => (
          <div key={tutor._id} className="flex justify-between p-4 border rounded">
            <div>
              <h2>{tutor.name}</h2>
              <p>{tutor.skills.join(', ')}</p>
            </div>
            <button onClick={() => handleSwipe(tutor._id)}>Swipe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Swiping;
