const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// Enable CORS for communication between the front-end and back-end
app.use(cors());

// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Save files in the /uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

// Initialize the Multer upload with the storage configuration
const upload = multer({ storage: storage });

// File upload route
// Change this to accept multiple files
app.post("/upload", upload.array("files", 10), (req, res) => {
  // "files" matches the key from the frontend
  try {
    res.status(200).json({
      message: "Files uploaded successfully",
      files: req.files, // `req.files` for multiple files
    });
  } catch (error) {
    res.status(500).json({ message: "File upload failed", error });
  }
});

// Start the server and listen on a specific port (e.g., 3000)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
