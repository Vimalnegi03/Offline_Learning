// import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
// import SwipedLearnersList from './SwipedLearnersList'; // Component to show swiped learners

// const TutorDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // Destructure user details from location.state
//   const { skills: userSkills, location: userLocation, id: userId } = location.state || {};

//   // Log for debugging
//   console.log("Location state:", location.state);
//   console.log("Tutor ID:", userId);

//   // Check if userId (tutorId) exists, otherwise redirect to login page or show an error message
//   if (!userId) {
//     // Optionally, you can use navigate to redirect if no ID is found
//     navigate('/login');  // Redirect to login if userId is missing
//     return <p className="text-center text-gray-500">Tutor ID not found. Please log in again.</p>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Tutor Dashboard</h2>
//       <SwipedLearnersList tutorId={userId} /> {/* Pass userId (tutorId) as prop */}
//     </div>
//   );
// };

// export default TutorDashboard;
