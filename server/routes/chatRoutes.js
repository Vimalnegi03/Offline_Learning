import express from 'express';
import Chat from '../models/chat.js'; // Import the Chat model

const router = express.Router();

// Route to fetch chat history between tutor and learner


// Route to delete chat history between tutor and learner (optional)
router.delete('/:tutorId/:learnerId', async (req, res) => {
  const { tutorId, learnerId } = req.params;

  try {
    // Delete the chat history between the tutor and learner
    await Chat.deleteMany({
      $or: [
        { tutorId, learnerId },
        { tutorId: learnerId, learnerId: tutorId },
      ],
    });

    res.json({ message: 'Chat history deleted successfully.' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
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


// Export the router
export default router;
