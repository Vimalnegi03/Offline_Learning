import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // For validation
import { motion } from 'framer-motion'; // For animations
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { url } from '../../url';

// Define the validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${url}/api/users/login`, values);
      const { role, skills, location, name, photo, id, swipes } = response.data;

      // Show success notification
      toast.success(`Welcome ${name}`, { position: "top-center" });

      // Check role and navigate accordingly
      if (role === 'learner') {
        navigate(`/learners/tutors`, { state: { role, skills, location, photo, id, swipes } });
      } else if (role === 'tutor') {
        navigate('/tutor-dashboard', { state: { role, skills, location, photo, id } });
      }
    } catch (error) {
      // Show error notification
      if (error.response) {
        toast.error(error.response.data.error || 'Login failed', { position: "top-center" });
      } else {
        toast.error('An error occurred. Please try again later.', { position: "top-center" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <button type="submit" className="btn btn-primary w-full mb-4" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <p className="text-sm">Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
        </div>

        {/* Toast Container to show notifications */}
        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default Login;
