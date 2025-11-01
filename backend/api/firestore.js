// backend/api/firestore.js
import express from "express";

/**
 * Firestore routes factory
 * @param {FirebaseFirestore.Firestore} db - initialized Firestore instance
 */
export default function firestoreRoutes(db) {
  const router = express.Router();

  // ⚡ usersRef MUST be defined inside this function
  const usersRef = db.collection("users");

  // CREATE user
  router.post("/users", async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) return res.status(400).json({ error: "Name and email required" });

      const docRef = await usersRef.add({ name, email, createdAt: new Date() });
      res.status(201).json({ id: docRef.id, name, email });
    } catch (err) {
      console.error("❌ Error creating user:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // READ all users
  router.get("/users", async (req, res) => {
    try {
      const snapshot = await usersRef.get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(users);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE user
  router.put("/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const docRef = usersRef.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: "User not found" });

      await docRef.update({ name, email, updatedAt: new Date() });
      res.json({ id, name, email });
    } catch (err) {
      console.error("❌ Error updating user:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE user
  router.delete("/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const docRef = usersRef.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: "User not found" });

      await docRef.delete();
      res.json({ success: true, id });
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
