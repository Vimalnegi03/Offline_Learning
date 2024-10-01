import { useState, useEffect } from 'react';
import axios from 'axios';
import { getDistance } from 'geolib';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { url } from '../../url';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const TutorsList = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate to redirect to the chat page

  const { 
    skills: userSkills = [], 
    location: userLocation = { coordinates: [0, 0] }, 
    id: userId = '', 
    swipes: userSwipes = [] 
  } = location.state || {};

  const [filteredTutors, setFilteredTutors] = useState([]);
  const [connectedTutors, setConnectedTutors] = useState([]); // State to track connected tutors

  const getPlaceName = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
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
      console.log("learner id hai" + userId);
      console.log("tutorID hai" + tutorID);

      const res = await axios.post(`${url}/api/users/connect`, {
        learnerId,
        tutorID,
      });

      console.log(res);
      toast.success('Connected successfully!'); // Use Toastify for success notification

      setConnectedTutors((prev) => [...prev, tutorID]);
    } catch (error) {
      console.error('Error connecting with tutor:', error.message);
      toast.error('Error connecting. Please try again.'); // Use Toastify for error notification
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/api/users/users`);
        const allUsers = response?.data || [];

        const tutorsList = allUsers.filter(user => user.role === 'tutor' && user?.location?.coordinates?.length === 2);

        const matchingTutors = await Promise.all(tutorsList.map(async tutor => {
          const hasMatchingSkills = userSkills?.length > 0
            ? tutor.skills?.some(skill => userSkills.includes(skill))
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
        }));

        setFilteredTutors(matchingTutors.filter(tutor => tutor !== null));
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching tutors'); // Error fetching tutors
      }
    };

    fetchUsers();
  }, [userSkills, userLocation]);

  const getButtonLabel = (tutor) => {
    const tutorSwipes = tutor?.swipes || [];
    if (userSwipes.includes(tutor._id) && tutorSwipes.includes(userId)) {
      return 'Chat';
    }
    if (userSwipes.includes(tutor._id)) {
      return 'Pending';
    }
    return 'Connect';
  };

  // Function to handle redirection to the chat page
  const handleChat = (tutorId) => {
    navigate('/chat', { state: { tutorId, learnerId: userId } });
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer /> {/* Toastify container */}
      <h2 className="text-2xl font-bold mb-4">Available Tutors</h2>
      {filteredTutors.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <li key={tutor._id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{tutor.name}</h3>
              <img src={tutor.photo || 'default-image.jpg'} alt={tutor.name} className="w-full h-48 object-cover rounded-md mb-2" />
              <p className="text-gray-700">Skills: {tutor.skills?.join(', ') || 'No skills listed'}</p>
              <p className="text-gray-600">Location: {tutor.placeName || 'Unknown location'}</p>
              <button
                onClick={() => {
                  const label = getButtonLabel(tutor);
                  if (label === 'Connect') handleConnect(tutor._id);
                  else if (label === 'Chat') handleChat(tutor._id);
                }}
                className={`mt-4 w-full font-semibold py-2 rounded-md transition duration-200 ${
                  getButtonLabel(tutor) === 'Pending' ? 'bg-gray-500 text-gray-200 cursor-not-allowed' :
                  getButtonLabel(tutor) === 'Chat' ? 'bg-green-500 text-white hover:bg-green-600' :
                  'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={getButtonLabel(tutor) === 'Pending'}
              >
                {getButtonLabel(tutor)}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No tutors found within 10km with matching skills.</p>
      )}
    </div>
  );
};

export default TutorsList;
