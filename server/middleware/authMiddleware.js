import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming you use JWT
      
      // Log the entire decoded token
      console.log('Decoded JWT payload:', decoded);

      // Attach user data to the request object
      req.user = decoded;
      req.userRole = decoded.role; // Assuming role is part of the token payload
      req.userLocation = decoded.location; // Assuming location is part of the token payload
  
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
};

  
