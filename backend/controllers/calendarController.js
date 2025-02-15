const db = require('../models/db');

// Naptár megnyitása
exports.openCalendar = (req, res) => {
    const { year, month } = req.body;

    // Először lezárjuk az összes nyitott hónapot
    const closeQuery = "UPDATE calendar_status SET is_open = false WHERE is_open = true";

    db.query(closeQuery, (closeErr) => {
        if (closeErr) {
            console.error("Database error while closing previous months:", closeErr);
            return res.status(500).json({ message: "Hiba történt a korábbi hónapok lezárásakor." });
        }

        // Ezután megnyitjuk az új hónapot
        const openQuery = `
            INSERT INTO calendar_status (year, month, is_open)
            VALUES (?, ?, true)
            ON DUPLICATE KEY UPDATE is_open = true
        `;

        db.query(openQuery, [year, month], (openErr) => {
            if (openErr) {
                console.error("Database error during calendar opening:", openErr);
                return res.status(500).json({ message: "Adatbázis hiba a naptár megnyitásakor." });
            }
            res.json({ message: `A hónap sikeresen megnyitva: ${year}-${month}.` });
        });
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

// Nyitott hónapok lekérése
exports.getOpenMonths = (req, res) => {
    try {
        db.query(
            "SELECT year, month FROM calendar_status WHERE is_open = 1 ORDER BY year ASC, month ASC",
            (error, results) => {
                if (error) {
                    console.error("Hiba a nyitott hónapok lekérdezésekor:", error);
                    return res.status(500).json({ message: "Hiba történt a nyitott hónapok lekérdezésekor." });
                }

                // Formázott hónapok létrehozása
                const formattedResults = results.map(row => ({
                    year: row.year,
                    month: row.month,
                    formattedMonth: new Date(row.year, row.month - 1)
                        .toLocaleDateString("hu-HU", { year: "numeric", month: "long" }) // Pl.: "2025. február"
                }));

                // Válaszban visszaküldjük a nyitott hónapok számát is
                res.json({
                    count: formattedResults.length,
                    openMonths: formattedResults
                });
            }
        );
    } catch (error) {
        console.error("Váratlan hiba a nyitott hónapok lekérdezésekor:", error);
        res.status(500).json({ message: "Váratlan hiba történt." });
    }
};
