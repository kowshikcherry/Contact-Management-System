import { verifyToken } from "./auth";
<<<<<<< HEAD
import dotenv from "dotenv";
=======
import dotenv from 'dotenv';
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95

dotenv.config();

const rateLimit = {};
<<<<<<< HEAD
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = process.env.MAX_REQUESTS;

const rateLimiter = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  let user;
  try {
    user = verifyToken(token);
    req.user = user;
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }

  const userId = user.id;
  const currentTime = Date.now();

  if (!rateLimit[userId]) {
    rateLimit[userId] = { count: 0, firstRequestTime: currentTime };
  }

  if (currentTime - rateLimit[userId].firstRequestTime > RATE_LIMIT_WINDOW) {
    rateLimit[userId] = { count: 1, firstRequestTime: currentTime };
  } else {
    rateLimit[userId].count += 1;
  }

  if (rateLimit[userId].count > MAX_REQUESTS) {
    return res
      .status(429)
      .json({ message: "Too many requests. Please try again later." });
  }

  next();
=======
const RATE_LIMIT_WINDOW = 60 * 1000; 
const MAX_REQUESTS = process.env.MAX_REQUESTS; 

const rateLimiter = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    let user;
    try {
        user = verifyToken(token);
    } catch (error) {
        return res.status(403).json({ message: error.message });
    }

    const userId = user.id; 
    const currentTime = Date.now();

    
    if (!rateLimit[userId]) {
        rateLimit[userId] = { count: 0, firstRequestTime: currentTime };
    }

    
    if (currentTime - rateLimit[userId].firstRequestTime > RATE_LIMIT_WINDOW) {
        rateLimit[userId] = { count: 1, firstRequestTime: currentTime }; 
    } else {
        rateLimit[userId].count += 1; 
    }

    
    if (rateLimit[userId].count > MAX_REQUESTS) {
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    next(); 
>>>>>>> 0bf3b90ab7f7bb2f26b935a4db63b4dba6d7af95
};

export default rateLimiter;
