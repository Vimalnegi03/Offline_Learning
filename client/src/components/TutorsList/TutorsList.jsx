import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getDistance } from 'geolib';
import { useLocation, useNavigate } from 'react-router-dom';
import { url } from '../../url';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TutorsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [photo, setPhoto] = useState(location.state.photo);
  const [name, setNaam] = useState(location.state.name);
  const [email] = useState(location.state.email);
  const {
    skills: userSkills = [],
    location: userLocation = { coordinates: [0, 0] },
    id: userId = '',
    swipes: userSwipes = []
  } = location.state || {};

  const [filteredTutors, setFilteredTutors] = useState([]);
  const [connectedTutors, setConnectedTutors] = useState([]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    toast.info('Logged out successfully!');
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile', { state: { userId } });
  };

  const getPlaceName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      return response?.data?.display_name || 'Location not found';
    } catch (error) {
      console.error('Error fetching place name:', error);
      return 'Location not found';
    }
  };

  const handleConnect = async (tutorId) => {
    try {
      const tutorID = tutorId;
      const learnerId = userId;

      await axios.post(`${url}/api/users/connect`, {
        learnerId,
        tutorID,
      });

      toast.success('Connection request sent!');
      setConnectedTutors((prev) => [...prev, tutorID]);
    } catch (error) {
      console.error('Error connecting with tutor:', error.message);
      toast.error('Error connecting. Please try again.');
    }
  };

  const handleChat = (tutorId) => {
    navigate('/chat', { state: { tutorId, learnerId: userId, name, photo } });
  };

  const getButtonLabel = (tutor) => {
    const tutorSwipes = tutor?.swipes || [];
    if (userSwipes.includes(tutor._id) && tutorSwipes.includes(userId)) {
      return 'Chat';
    }
    if (connectedTutors.includes(tutor._id)) {
      return 'Pending';
    }
    return 'Connect';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/api/users/users`);
        const allUsers = response?.data || [];

        const tutorsList = allUsers.filter(
          (user) => user.role === 'tutor' && user?.location?.coordinates?.length === 2
        );

        const matchingTutors = await Promise.all(
          tutorsList.map(async (tutor) => {
            const normalizedUserSkills =
              userSkills[0]?.split(',').map((skill) => skill.trim().toLowerCase()) || [];
            const normalizedTutorSkills =
              tutor.skills?.[0]?.split(',').map((skill) => skill.trim().toLowerCase()) || [];

            const hasMatchingSkills = normalizedUserSkills.length > 0
              ? normalizedTutorSkills.some((skill) => normalizedUserSkills.includes(skill))
              : true;

            const tutorLocation = tutor.location?.coordinates || [0, 0];
            const distance = getDistance(
              { latitude: userLocation?.coordinates[1], longitude: userLocation?.coordinates[0] },
              { latitude: tutorLocation[1], longitude: tutorLocation[0] }
            );

            if (hasMatchingSkills && distance <= 10000) {
              const placeName = await getPlaceName(tutorLocation[1], tutorLocation[0]);
              return { ...tutor, placeName };
            }
            return null;
          })
        );

        setFilteredTutors(matchingTutors.filter((tutor) => tutor !== null));
      } catch (error) {
        console.error('Error fetching tutors:', error);
        toast.error('Error fetching tutors');
      }
    };

    fetchUsers();
  }, [userSkills, userLocation]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen relative">
      <ToastContainer />
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDropdown}
          className="w-10 h-10 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center focus:outline-none shadow-md hover:scale-105 transition-transform"
        >
          {name.charAt(0).toUpperCase()}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <div className="p-4">
              <p className="font-semibold text-gray-800 truncate" title={name}>
                {name}
              </p>
            </div>
            <hr />
            <button
              onClick={handleUpdateProfile}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
            >
              Update Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Available Tutors</h2>
      {filteredTutors.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <li
              key={tutor._id}
              className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{tutor.name}</h3>
              <img
                src={tutor.photo || 'default-image.jpg'}
                alt={tutor.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-gray-700 mb-2">Skills: {tutor.skills?.join(', ') || 'No skills listed'}</p>
              <p className="text-gray-600 mb-4">Description: {tutor.description || 'No description available'}</p>

              <button
                onClick={() => {
                  const label = getButtonLabel(tutor);
                  if (label === 'Connect') handleConnect(tutor._id);
                  else if (label === 'Chat') handleChat(tutor._id);
                }}
                className={`w-full py-2 font-semibold rounded-md transition duration-200 ${
                  getButtonLabel(tutor) === 'Pending'
                    ? 'bg-gray-500 text-gray-200 cursor-not-allowed'
                    : getButtonLabel(tutor) === 'Chat'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={getButtonLabel(tutor) === 'Pending'}
              >
                {getButtonLabel(tutor)}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No tutors found within 10km with matching skills.</p>
      )}
    </div>
  );
};

export default TutorsList;
