require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Azure Blob Storage configuration
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerName = 'syncshare'; // Replace with your container name
const containerClient = blobServiceClient.getContainerClient(containerName);

// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Create a container client
    const containerName = 'your-container-name';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create a blob client
    const blobName = file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to the blob
    await blockBlobClient.uploadFile(file.path);

    // Optionally, delete the file from the server after uploading to blob storage
    // fs.unlinkSync(file.path);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).send('Error uploading file.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
