// src/components/Auth/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { url } from '../../url';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    skills: '',
    location: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, gender, location, photo } = formData;

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('password', password);
    data.append('gender', gender);
    data.append('location', location);
    data.append('skills', formData.skills.split(','));
    data.append('photo', photo);

    try {
      const response = await axios.post(`${url}/api/users/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      alert(response.data.message);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>
      <div>
        <label className="block text-gray-600 mb-2" htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-600 mb-2" htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-600 mb-2" htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-600 mb-2" htmlFor="gender">Gender</label>
        <select
          name="gender"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-600 mb-2" htmlFor="skills">Skills (comma separated)</label>
        <input
          type="text"
          name="skills"
          placeholder="e.g., JavaScript, React"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-600 mb-2" htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          placeholder="Enter your location"
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-600 mb-2" htmlFor="photo">Profile Photo</label>
        <input
          type="file"
          name="photo"
          onChange={handleFileChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>
      <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none">
        Register
      </button>
    </form>
  );
};

export default Register;
