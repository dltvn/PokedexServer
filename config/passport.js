import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { userCollection } from "../config/db.js";
import { ObjectId } from "mongodb";
import passport from "passport";

export function config(app) {
  // app.use(passport.initialize());

  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: process.env.GOOGLE_CLIENT_ID,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //       callbackURL: "/api/auth/callback/google",
  //     },
  //     async (accessToken, refreshToken, profile, done) => {
  //       try {
  //         console.log(profile, "MongoDB Collection Check");

  //         let user = await userCollection.findOne({ googleId: profile.id });
  //         if (!user) {
  //           const newUser = {
  //             googleId: profile.id,
  //             name: profile.displayName,
  //             email: profile.emails[0].value,
  //             createdAt: new Date(),
  //           };

  //           const result = await userCollection.insertOne(newUser);
  //           user = await userCollection.findOne({ _id: result.insertedId });
  //         }
  //         done(null, user);
  //       } catch (err) {
  //         console.error("Error in Google Strategy:", err);
  //         done(err, null);
  //       }
  //     }
  //   )
  // );

  // app.get(
  //   "/api/auth/google",
  //   passport.authenticate("google", {
  //     scope: ["profile", "email"],
  //   })
  // );

  // app.get(
  //   "/api/auth/callback/google",
  //   passport.authenticate("google", { session: false }),
  //   (req, res) => {
  //     const token = jwt.sign(
  //       {
  //         id: req.user._id,
  //         googleId: req.user.googleId,
  //         email: req.user.email,
  //         name: req.user.name,
  //       },
  //       process.env.SECRET_KEY,
  //       { expiresIn: "2d" }
  //     );

  //     res.json({ token });
  //   }
  // );


}
