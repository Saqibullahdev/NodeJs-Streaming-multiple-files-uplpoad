import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import pLimit from 'p-limit'; // Change to ESM import
import cors from 'cors';

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dzzmpu8vk',
  api_key: '259721591533388',
  api_secret: 'NDgIK1te-ilu_pyJ7oidNveJPkw',
});

app.use(cors());

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Store temporarily in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Create a p-limit instance with a concurrency limit (e.g., 3 concurrent uploads)
const limit = pLimit(10); // Limiting to 3 concurrent uploads at a time

// Handle file upload route
app.post('/upload', upload.array('images', 10), async (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files uploaded.');
  }

  try {
    const fileUrls = [];

    // Use the p-limit to control concurrency
    const uploadPromises = req.files.map(file =>
      limit(async () => {
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(file.path);

        // Add Cloudinary URL to the response array
        fileUrls.push(result.secure_url);

        // Delete the file from the local server after upload
        fs.unlinkSync(file.path);
      })
    );

    // Wait for all promises to complete
    await Promise.all(uploadPromises);

    // Return success response with file URLs stored in Cloudinary
    res.status(200).json({
      message: 'Files uploaded successfully!',
      files: fileUrls,
    });
    console.log('Files uploaded successfully!');
    console.log(fileUrls);
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).send('Error uploading files.');
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Express server running on port 5000');
});
