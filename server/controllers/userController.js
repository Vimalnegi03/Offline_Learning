import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uploadOnCloudinary from '../cloudinaryConfig.js'; // Adjust the import path as necessary
import axios from 'axios';

const generateToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
        location: user.location, // Include location
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }); // Adjust expiration as needed
};


const getCoordinates = async (address) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
      });
  
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: lat, longitude: lon };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching location data');
    }
  };

// Register a new user with photo upload
export const registerUser = async (req, res) => {
    console.log("Received request:", req.body); // Log the request body
    console.log("File received:", req.file); // Log the file received
  
    const { name, email, password, gender,role,location } = req.body;
    const skills = req.body.skills;
    try {
        const coordinates = await getCoordinates(location);
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      console.log("Existing user check:", existingUser); // Log the existing user check
  
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
     // Check if files exist before accessing
    if (!req.files || !req.files.photo || !req.files.photo[0]) {
        return res.status(400).json( {message:"Avatar file is required"});
    }

    const avatarLocalPath = req.files.photo[0].path; // Avatar file path
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        return res.status(400).json( {message:"Avatar file is required"});
    }
      // Create new user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        gender,
        skills, // Assuming skills are passed as a comma-separated string
        photo: avatar.url, // Store the secure URL from Cloudinary
        role: role || 'learner',
        location: {
            type: 'Point',
            coordinates: [coordinates.longitude, coordinates.latitude],
          }, 
      });
  
      // Generate a JWT token
      const token = generateToken(user);
  
      res.status(201).json({
        message: "User successfully created",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photo: user.photo,
          location: user.location.coordinates,
          swipes:user.swipes
        },
        token
      });
    } catch (error) {
      console.error("Error in registerUser:", error); // Log the error
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Sign in a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = generateToken(user);
  
      res.status(200).json({ token,
        role: user.role,
        location: user.location,
    skills:user.skills,
photo:user.photo,
id:user._id,
swipes:user.swipes
});
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Get all users (admin function)
  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  export const tutorConnect=async (req, res) => {
    const { learnerId, tutorID } = req.body;
    console.log(learnerId);
    console.log(tutorID);
  try {
    // Convert string IDs to ObjectId
    // const learnerObjectId = mongoose.Types.ObjectId(learnerId);
    // const tutorObjectId = mongoose.Types.ObjectId(tutorID);

    // Find the tutor and add the learnerId to the swipes array
    const tutor = await User.findByIdAndUpdate(
      tutorID,
      { $addToSet: { swipes: learnerId } }, // Use $addToSet to avoid duplicates
      { new: true }
    );

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    res.status(200).json({ message: 'Successfully connected with tutor', tutor });
  } catch (error) {
    console.error('Error connecting with tutor:', error);
    res.status(500).json({ error: 'An error occurred while connecting with the tutor' });
  }
  }
  ;
  
 export  const getSwipedLearners = async (req, res) => {
    const { tutorId } = req.params;
    try {
      // Find the tutor by ID and populate the swipes field with learner details
      const tutor = await User.findById(tutorId).populate('swipes'); // Populate 'swipes' with learner details
  
      if (!tutor) {
        return res.status(404).json({ error: 'Tutor not found' });
      }
  
      // Return the learners who swiped on the tutor
      res.status(200).json({ learners: tutor.swipes });
    } catch (error) {
      console.error('Error fetching swiped learners:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  // Assuming you're using Express.js
export const learnerConnect= async (req, res) => {
    const { userId, learnerId } = req.body;
  
    try {
      // Find the learner and update their swipes array with the tutor's ID
      const learner = await User.findById(learnerId);
      if (!learner) return res.status(404).json({ message: 'Learner not found' });
  
      learner.swipes.push(userId); // Add tutorId to learner's swipes array
      await learner.save();
  
      res.status(200).json({ message: 'Connected successfully!' });
    } catch (error) {
      console.error('Error connecting tutor to learner:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const mutualSwipes=async (req, res) => {
    const { learnerId, tutorId } = req.params;
    
    try {
      const learner = await User.findById(learnerId);
      const tutor = await User.findById(tutorId);
  
      const isMutualSwipe = learner.swipes.includes(tutorId) && tutor.swipes.includes(learnerId);
      res.json({ isMutualSwipe });
    } catch (error) {
      console.error('Error checking mutual swipes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  