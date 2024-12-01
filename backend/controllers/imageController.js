const db = require('../models/db');
const fs = require('fs');
const path = require('path');

// Multer upload instance (imported from the main server or a utils file)
const { upload } = require('../utils/multerConfig');

exports.uploadImages = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            // Handle errors from multer
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(400).json({ message: err.message });
        }

        // If no files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Array to store the image paths
        const imagePaths = req.files.map(file => `/images/${file.filename}`);

        // Prepare SQL insert statement for multiple files
        const sql = 'INSERT INTO reference_images (image_path, created_at) VALUES ?';
        const values = imagePaths.map(path => [path, new Date()]);

        // Insert image paths into the database
        db.query(sql, [values], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.status(201).json({ message: 'Images uploaded successfully', imagePaths });
        });
    });
};

exports.getPaginatedImages = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const sql = 'SELECT * FROM reference_images ORDER BY created_at DESC LIMIT ? OFFSET ?';
    db.query(sql, [limit, offset], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};

exports.deleteImageById = (req, res) => {
    const imageId = req.params.id;

    // Retrieve the image path from the database
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
        const fullImagePath = path.join(__dirname, '../../frontend/public', imagePath);

        // Delete the image file from the filesystem
        fs.unlink(fullImagePath, (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ message: 'Error deleting image file' });
            }

            // Delete the record from the database
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
};
