import { Router } from 'express';
import passport from 'passport';
import axios from 'axios';
import jwt from "jsonwebtoken";
import { userCollection } from "../config/db.js";

const router = Router();

/**
 * sign in/sign up, logic is in passport.js
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * after successful sign in from google
 */
router.get(
  '/callback/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // for test
    res.redirect(`${process.env.REACT_BASE_URL}/pokedex`);

  }
);

/**
 * sign out
 */
router.get('/signout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('sign out failed');
    }
    res.redirect('/');
  });
});


router.post("/google", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  try {
    // Verify the ID Token with Google's tokeninfo API
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const { email, name } = response.data;

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
