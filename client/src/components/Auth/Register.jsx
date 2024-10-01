import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // For validation
import { motion } from 'framer-motion'; // For animations
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { url } from '../../url';

// Define the validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
  gender: Yup.string().oneOf(['Male', 'Female'], 'Invalid Gender').required('Gender is required'),
  skills: Yup.string().required('Skills are required'),
  location: Yup.string().required('Location is required'),
  role: Yup.string().oneOf(['learner', 'tutor'], 'Invalid Role').required('Role is required'),
  photo: Yup.mixed().required('Profile photo is required'),
});

const Register = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('gender', values.gender);
      formData.append('skills', values.skills.split(','));
      formData.append('location', values.location);
      formData.append('role', values.role);
      formData.append('photo', values.photo);

      const response = await axios.post(`${url}/api/users/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success notification
      toast.success(response.data.message || 'Registration successful!', { position: "top-center" });

      resetForm(); // Reset form after successful submission
    } catch (error) {
      // Show error notification
      toast.error(error.response?.data?.message || 'Registration failed', { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          gender: '',
          skills: '',
          location: '',
          role: '',
          photo: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2" htmlFor="name">Name</label>
              <Field
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-gray-600 mb-2" htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-gray-600 mb-2" htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-gray-600 mb-2" htmlFor="gender">Gender</label>
              <Field
                as="select"
                name="gender"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-gray-600 mb-2" htmlFor="skills">Skills (comma separated)</label>
              <Field
                type="text"
                name="skills"
                placeholder="e.g., JavaScript, React"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
              <ErrorMessage name="skills" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-gray-600 mb-2" htmlFor="location">Location</label>
              <Field
                type="text"
                name="location"
                placeholder="Enter your location"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              />
              <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-gray-600 mb-2" htmlFor="role">Role</label>
              <Field
                as="select"
                name="role"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="">Select Role</option>
                <option value="learner">Learner</option>
                <option value="tutor">Tutor</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-gray-600 mb-2" htmlFor="photo">Profile Photo</label>
              <input
                type="file"
                name="photo"
                onChange={(e) => setFieldValue('photo', e.currentTarget.files[0])}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
              />
              <ErrorMessage name="photo" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>

      <ToastContainer />
    </motion.div>
  );
};

export default Register;
