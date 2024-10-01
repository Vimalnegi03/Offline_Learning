import { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../../url';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const SwipedLearnersList = ({tutorId}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate to redirect
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: userId } = location.state || {};

  useEffect(() => {
    const fetchSwipedLearners = async () => {
      try {
        console.log("Fetching swiped learners for tutor: " + userId);

        // Fetch learners who swiped on the tutor
        const response = await axios.get(`${url}/api/users/swipes/${userId}`);

        if (response.data.learners && Array.isArray(response.data.learners)) {
          setLearners(response.data.learners);
        } else {
          setLearners([]);
        }
      } catch (error) {
        console.error('Error fetching swiped learners:', error);
        setError('Failed to fetch swiped learners.');
        toast.error('Failed to fetch swiped learners.'); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSwipedLearners();
    } else {
      setLoading(false);
      setError('Tutor ID not found. Please log in again.');
      toast.error('Tutor ID not found. Please log in again.'); // Error toast
    }
  }, [tutorId, userId]);

  // Function to handle 'Connect' button click
  const handleConnect = async (learnerId) => {
    try {
      await axios.post(`${url}/api/users/connect_learner`, { userId, learnerId });
      console.log(`Tutor ${userId} connected with learner ${learnerId}`);
      
      // Show success toast
      toast.success('Successfully connected with the learner!');

      // Optionally, refresh the list or update the state
      const updatedLearners = learners.map(learner =>
        learner._id === learnerId ? { ...learner, hasConnected: true } : learner
      );
      setLearners(updatedLearners);
    } catch (error) {
      console.error('Error connecting with learner:', error);
      toast.error('Failed to connect with the learner.'); // Error toast
    }
  };

  // Function to handle 'Chat' button click
  const handleChat = (learnerId) => {
    let tutorId = userId;
    let temp = learnerId;
    learnerId = tutorId;
    tutorId = temp;
    console.log("Sender ID: " + learnerId);
    navigate('/chat', { state: { tutorId, learnerId } }); // Navigate to chat with IDs
    toast.info('Redirecting to chat...'); // Info toast
  };

  // Render logic based on loading, error, and learners state
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (learners.length === 0) {
    return <p className="text-gray-500">No learners have swiped right on you yet.</p>;
  }

  return (
    <div>
      <ToastContainer /> {/* Toast container for notifications */}
      <h2 className="text-2xl font-bold mb-4">Learners Who Swiped Right on You</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learners.map((learner) => (
          <li key={learner._id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{learner.name}</h3>
            <img src={learner.photo} alt={learner.name} className="w-full h-48 object-cover rounded-md mb-2" />
            <p className="text-gray-700">Skills: {learner.skills.join(', ')}</p>
            <p className="text-gray-600">Location: {learner.location.coordinates.join(', ')}</p>

            {/* Connect or Chat button */}
            {learner.swipes.includes(userId)  
            ? (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={() => handleChat(learner._id)} // Chat functionality
              >
                Chat
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => handleConnect(learner._id)}
              >
                Connect
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SwipedLearnersList;
