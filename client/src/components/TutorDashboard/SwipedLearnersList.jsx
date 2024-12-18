import { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../../url';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SwipedLearnersList = ({ tutorId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: userId, email } = location.state || {};
  const [photo, setPhoto] = useState(location.state?.photo);
  const [name, setNaam] = useState(location.state?.name);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fetchSwipedLearners = async () => {
      try {
        console.log(`Fetching swiped learners for tutor: ${userId}`);

        // Fetch learners who swiped on the tutor
        const response = await axios.get(`${url}/api/users/swipes/${userId}`);

        if (response.data.learners && Array.isArray(response.data.learners)) {
          setLearners(response.data.learners);

          // Fetch unread message counts for each learner in parallel
          const counts = await Promise.all(
            response.data.learners.map(async (learner) => {
              try {
                const unreadResponse = await axios.get(
                  `${url}/api/chats/unread/${userId}/${learner._id}`
                );
                console.log(unreadResponse.data);
                
                return { learnerId: learner._id, unreadCount: unreadResponse.data.unreadCount || 0 };
              } catch (err) {
                console.error(`Error fetching unread count for learner ${learner._id}:`, err);
                return { learnerId: learner._id, unreadCount: 0 };
              }
            })
          );

          // Transform counts array into a mapping object
          const countsMap = counts.reduce((acc, { learnerId, unreadCount }) => {
            acc[learnerId] = unreadCount;
            return acc;
          }, {});
          setUnreadCounts(countsMap);
        } else {
          setLearners([]);
        }
      } catch (error) {
        console.error('Error fetching swiped learners:', error);
        setError('Failed to fetch swiped learners.');
        toast.error('Failed to fetch swiped learners.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSwipedLearners();
    } else {
      setLoading(false);
      setError('Tutor ID not found. Please log in again.');
      toast.error('Tutor ID not found. Please log in again.');
    }
  }, [tutorId, userId,setLearners,setUnreadCounts]);

  // Handle 'Chat' button click
  const handleConnect = async (learnerId) => {
    try {
      await axios.post(`${url}/api/users/connect_learner`, { userId, learnerId });
      console.log(`Tutor ${userId} connected with learner ${learnerId}`);

      // Show success toast
      toast.success('Successfully connected with the learner!');

      // Optionally, refresh the list or update the state
      const updatedLearners = learners.map((learner) =>
        learner._id === learnerId ? { ...learner, hasConnected: true } : learner
      );
      setLearners(updatedLearners);
    } catch (error) {
      console.error('Error connecting with learner:', error);
      toast.error('Failed to connect with the learner.'); // Error toast
    }
  };
  const handleChat = (learnerId) => {
    console.log(`Navigating to chat for tutor: ${userId}, learner: ${learnerId}`);
    let tutorId = userId;
    let temp = learnerId;
    learnerId = tutorId;
    tutorId = temp;
    console.log('Sender ID: ' + learnerId);
    navigate('/chat', { state: { tutorId, learnerId, name, photo } });
    toast.info('Redirecting to chat...');
  };

  // Render logic
  const handleLogout = () => {
    toast.success('Logged out successfully!');
    navigate('/login'); // Redirect to login page
  };
  const handleUpdateProfile = () => {
    navigate('/update-profile', { state: { userId } }); // Navigate to update profile page
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (learners.length === 0) {
    return <p className="text-gray-500">No learners have swiped right on you yet.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <ToastContainer />
       {/* Top-right profile icon */}
       <div className="absolute top-4 right-4">
        <button
          className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {name ? name[0].toUpperCase() : 'U'}
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
            <p className="p-4 text-gray-700 text-sm border-b">{name}</p>
            <button
        onClick={handleUpdateProfile}
        className="w-full text-left px-4 py-2 hover:bg-green-300 text-gray-800 transition-colors"
      >
        Update Profile
      </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-400"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-6">Learners Who Swiped Right on You</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learners.map((learner) => (
          <li
            key={learner._id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{learner.name}</h3>
            <img
              src={learner.photo}
              alt={learner.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="text-gray-700 mb-2">Skills: {learner.skills.join(', ')}</p>
            <p className="text-gray-600 mb-4">Description: {learner?.description}</p>

            {learner.swipes.includes(userId) ? (
              <button
                className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-200 relative"
                onClick={() => handleChat(learner._id)}
              >
                Chat
                {unreadCounts[learner._id] > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCounts[learner._id]}
                  </span>
                )}
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-200"
                onClick={()=> handleConnect(learner._id)}
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
