import { Router } from 'express';
import axios from 'axios';
import jwt from "jsonwebtoken";
import { userCollection } from "../config/db.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { ObjectId } from "mongodb";
const router = Router();

/**
 * user info
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await userCollection.findOne({ _id: new ObjectId(req.userId) });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }

    res.json({user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/**
 * sign out
 */
router.get('/signout', (req, res) => {
});

/**
 * sign in
 */
router.post("/google", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    // Verify the ID Token with Google's tokeninfo API
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const { email, name, picture } = response.data;

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    // Check if the user exists in the database by email
    let user = await userCollection.findOne({ email });
    if (!user) {
      // Create a new user if not found
      const newUser = {
        email,
        name,
        picture,
        createdAt: new Date(),
      };

      const result = await userCollection.insertOne(newUser);
      user = await userCollection.findOne({ _id: result.insertedId });
    }

    // Generate a JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.SECRET_KEY, // Secret key for signing JWT
      { expiresIn: "2d" } // Token expiration
    );

    res.status(200).json({ message: "User authenticated", token });
  } catch (error) {
    console.error("Error verifying ID token:", error.response?.data || error);
    res.status(401).json({ error: "Invalid ID token" });
  }
});

export default router;
