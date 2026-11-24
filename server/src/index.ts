import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./routes.js";

const app = express();
app.use(cors());

const PORT = 5000;

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});


app.use("/api", router);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});