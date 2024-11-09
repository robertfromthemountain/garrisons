const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const db = require('../database/database'); // Adjust the path if needed
const { authenticateToken, isAdmin } = require('../middlewares/authenticate'); // Adjust the path if needed

const router = express.Router();

// Multer configuration to store images in the 'garrisons/frontend/public/images' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../frontend/public/images')); // Adjust the path if needed
    },
    filename: (req, file, cb) => {
        const randomString = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname); // Get the file extension
        const uniqueFilename = `${Date.now()}-${randomString}${ext}`;
        cb(null, uniqueFilename);
    },
});

// Define allowed file types (MIME types)
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Validate file type and size before saving
const fileFilter = (req, file, cb) => {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
    }
    cb(null, true); // Accept the file if valid
};

// Limit file size to 2MB per file and allow up to 10 files
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit per file
}).array('images', 10); // .array for multiple file uploads, limit to 10 files

// API route for uploading multiple images
router.post('/upload-images', authenticateToken, isAdmin, (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const imagePaths = req.files.map(file => `/images/${file.filename}`);
        const sql = 'INSERT INTO reference_images (image_path, created_at) VALUES ?';
        const values = imagePaths.map(path => [path, new Date()]);

        db.query(sql, [values], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.status(201).json({ message: 'Images uploaded successfully', imagePaths });
        });
    });
});

// API route for getting paginated images
router.get('/images', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    const sql = 'SELECT * FROM reference_images ORDER BY created_at DESC LIMIT ? OFFSET ?';

    db.query(sql, [limit, offset], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

// API route to delete an image by ID
router.delete('/images/:id', authenticateToken, isAdmin, (req, res) => {
    const imageId = req.params.id;

    const sqlSelect = 'SELECT image_path FROM reference_images WHERE id = ?';
    db.query(sqlSelect, [imageId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const imagePath = result[0].image_path;
        const fullImagePath = path.join(__dirname, '../../../frontend/public', imagePath);

        fs.unlink(fullImagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ message: 'Error deleting image file' });
            }

            const sqlDelete = 'DELETE FROM reference_images WHERE id = ?';
            db.query(sqlDelete, [imageId], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                res.status(200).json({ message: 'Image deleted successfully' });
            });
        });
    });
});

module.exports = router;