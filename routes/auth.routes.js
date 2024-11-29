import { Router } from 'express';
import passport from 'passport';

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

export default router;
