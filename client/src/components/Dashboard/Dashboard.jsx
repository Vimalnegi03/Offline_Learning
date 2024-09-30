import React from 'react';
import TutorsList from '../TutorsList/TutorsList';

const Dashboard = () => {
  const learnerId = localStorage.getItem('learnerId'); // Assuming learnerId is stored in local storage

  if (!learnerId) {
    return <p>You must be logged in as a learner to view this page.</p>;
  }

  return (
    <div className="dashboard">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <TutorsList learnerId={learnerId} />
    </div>
  );
};

export default Dashboard;
