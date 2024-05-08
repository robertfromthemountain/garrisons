const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'garrisons'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // No token found

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next();
    });
}

// Registration endpoint
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10
        const sqlInsert = `INSERT INTO users (firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)`;
        db.query(sqlInsert, [firstName, lastName, email, phoneNumber, hashedPassword], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
                return;
            }
            res.status(201).send('User registered');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    console.log('Login request for email:', req.body.email);
    const { email, password } = req.body;
    try {
        const sqlSelect = 'SELECT * FROM users WHERE email = ?';
        db.query(sqlSelect, [email], async (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Database error');
                return;
            }
            if (results.length > 0) {
                const user = results[0];
                const validPassword = await bcrypt.compare(password, user.password);
                if (validPassword) {
                    const token = jwt.sign(
                        { userId: user.id, email: user.email },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    res.json({ token });
                } else {
                    res.status(401).send('Invalid credentials');
                }

            } else {
                res.status(404).send('User not found');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
