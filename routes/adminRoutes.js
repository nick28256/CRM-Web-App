const express = require("express");
const router = express.Router();
const admin = require("../firebaseAdmin");
const firebaseAuth = require("../middleware/firebaseAuth");

// Apply auth middleware to all routes below
router.use(firebaseAuth);

// Create user
router.post("/users", async (req, res) => {
  try {
    const user = await admin.auth().createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user by UID
router.get("/users/:uid", async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.params.uid);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Update user
router.put("/users/:uid", async (req, res) => {
  try {
    const user = await admin.auth().updateUser(req.params.uid, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
router.delete("/users/:uid", async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.uid);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List users (paginated, 1000 max per page)
router.get("/users", async (req, res) => {
  const maxResults = parseInt(req.query.limit) || 100; // default 100 users per page
  const pageToken = req.query.pageToken; // for pagination

  try {
    const listUsersResult = await admin.auth().listUsers(maxResults, pageToken);
    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      phoneNumber: userRecord.phoneNumber,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
      customClaims: userRecord.customClaims,
      metadata: userRecord.metadata, // includes creationTime, lastSignInTime
      providerData: userRecord.providerData
    }));
    res.json({
      users,
      nextPageToken: listUsersResult.pageToken // use this for next page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;