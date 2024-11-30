import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userCollection } from "../config/db.js";
import { ObjectId } from "mongodb";
import session from "express-session";
import passport from "passport";
import MongoStore from 'connect-mongo';
//import FileStoreModule from 'session-file-store';

//const FileStore = FileStoreModule(session);

export function config(app) {
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
        ttl: 60 * 60, // Session expiration time in seconds (1 hour)
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60, // Cookie expiration time in milliseconds (1 hour)
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/callback/google",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile, "MongoDB Collection Check");

          // Check if the user already exists in the database
          let user = await userCollection.findOne({ googleId: profile.id });
          if (!user) {
            console.log("new user");
            // If user doesn't exist, create a new one
            const newUser = {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value, // Corrected to access email from profile
              createdAt: new Date(),
            };

            const result = await userCollection.insertOne(newUser);
            // Fetch the newly created user using the insertedId
            user = await userCollection.findOne({ _id: result.insertedId });
          } else {
            console.log("헌유저");
          }
          console.log("done한다고 씨발");
          done(null, user); // Pass the user object to Passport
        } catch (err) {
          console.error("Error in Google Strategy:", err);
          done(err, null); // Handle error during authentication
        }
      }
    )
  );

  // Serialize the user into the session
  passport.serializeUser((user, done) => done(null, user._id));

  // Deserialize the user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      user._id = id;
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
