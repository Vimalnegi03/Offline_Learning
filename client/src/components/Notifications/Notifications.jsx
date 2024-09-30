// src/components/Notifications/Notifications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../url';
const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${url}/api/notifications/${userId}`);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
