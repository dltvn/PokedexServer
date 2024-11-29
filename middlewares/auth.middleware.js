import { ObjectId } from "mongodb";

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    const userId = req.user._id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    req.userId = userId;
    return next();
  }
  res.status(401).json({ error: "Unauthorized: User is not logged in." });
}
