import React, { useState } from 'react';
import axios from 'axios';
import { url } from '../../url';
import { useNavigate } from 'react-router-dom'; // For navigation

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/users/login`, { email, password });
      console.log(response.data);
      
      // Destructure necessary data
      const { role, skills, location, name, photo, id, swipes } = response.data;
      console.log("Swipes:", swipes);

      // Check role and navigate accordingly
      if (role === 'learner') {
        console.log("Logged in as learner:", role);
        navigate(`/learners/tutors`, { state: { role, skills, location, photo, id, swipes } });
      } else if (role === 'tutor') {
        console.log("Logged in as tutor:", role);
        // Navigate to TutorDashboard and pass the tutor's ID via state
        navigate('/tutor-dashboard', { state: { role, skills, location, photo, id } });
      } else {
        alert(`Welcome, ${name}`);
      }
    } catch (error) {
      if (error.response) {
        console.error('Login error response:', error.response.data);
        alert(error.response.data.error || 'Login failed');
      } else {
        console.error('Login error:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mb-4">Login</button>

        <div className="text-center">
          <p className="text-sm">Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
