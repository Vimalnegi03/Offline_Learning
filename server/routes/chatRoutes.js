import express from 'express';
import Chat from '../models/chat.js'; // Import the Chat model

const router = express.Router();

// Route to fetch chat history between tutor and learner


// Route to delete chat history between tutor and learner (optional)


router.get('/:learnerId/:tutorId', async (req, res) => {
  const { learnerId, tutorId } = req.params;
  
  const chatHistory = await Chat.find({
    $or: [
      { senderId: learnerId, receiverId: tutorId },
      { senderId: tutorId, receiverId: learnerId }
    ]
  }).sort({ timestamp: 1 }); // Sort by timestamp to get in the right order
  
  res.json(chatHistory);
});
router.get('/unread/:userId/:learnerId', async (req, res) => {
  try {
    const { userId, learnerId } = req.params;

    // Log to check received parameters
    console.log('Received Params:', userId, learnerId);

    // Fetch all messages for the given sender and receiver and check isRead status
    const unreadMessages = await Chat.find({
      senderId: learnerId,     // learner is the sender
      receiverId: userId,      // tutor is the receiver
      isRead: false          // Only unread messages
    });

    // Log the unread messages
    console.log('Unread Messages:', unreadMessages);
    
    
    // Count unread messages
    const unreadCount = unreadMessages.length;
    console.log(unreadCount);

    // Send the response
    res.status(200).json({ success: true, unreadCount});
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread messages.' });
  }
});
router.put('/mark-read/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    // Update messages where the sender is senderId and the receiver is receiverId
    await Chat.updateMany(
      { senderId, receiverId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: 'Messages sent by the sender have been marked as read.' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Error marking messages as read' });
  }
});


// Export the router
export default router;
