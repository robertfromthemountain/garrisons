const db = require('../models/db');

// Naptár megnyitása
exports.openCalendar = (req, res) => {
    const { year, month } = req.body;

    const query = `
        INSERT INTO calendar_status (year, month, is_open)
        VALUES (?, ?, true)
        ON DUPLICATE KEY UPDATE is_open = true
    `;

    db.query(query, [year, month], (err) => {
        if (err) {
            console.error('Database error during calendar opening:', err);
            return res.status(500).json({ message: 'Adatbázis hiba a naptár megnyitásakor.' });
        }
        res.json({ message: 'A következő hónap sikeresen megnyitva.' });
    });
};

// Naptár lezárása
exports.closeCalendar = (req, res) => {
    const { year, month } = req.body;

    const query = `
        UPDATE calendar_status
        SET is_open = false
        WHERE year = ? AND month = ?
    `;

    db.query(query, [year, month], (err, result) => {
        if (err) {
            console.error('Database error during calendar closing:', err);
            return res.status(500).json({ message: 'Adatbázis hiba a naptár lezárásakor.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'A megadott hónap nem található.' });
        }
        res.json({ message: 'Az aktuális hónap sikeresen lezárva.' });
    });
};

// Naptár állapot lekérdezése
exports.getCalendarStatus = (req, res) => {
    const { year, month } = req.params;

    const query = `
        SELECT is_open FROM calendar_status
        WHERE year = ? AND month = ?
    `;

    db.query(query, [year, month], (err, results) => {
        if (err) {
            console.error('Database error during calendar status check:', err);
            return res.status(500).json({ message: 'Adatbázis hiba a naptár állapot lekérdezésekor.' });
        }
        if (results.length > 0 && results[0].is_open) {
            res.json({ is_open: true });
        } else {
            res.json({ is_open: false });
        }
    });
};
