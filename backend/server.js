const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const businessHoursRoutes = require('./routes/businessHoursRoutes');
const calendarRoutes = require('./routes/calendarRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// **Middleware-k hozzáadása**
app.use(bodyParser.json());
app.use(cookieParser()); // Engedélyezzük a cookie-k használatát

const corsOptions = {
    origin: 'http://localhost:5173', // Cseréld le a frontend URL-edre, ha szükséges
    credentials: true, // Engedélyezzük a sütik átvitelét
};
app.use(cors(corsOptions));

// **API útvonalak**
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', appointmentRoutes);
app.use('/api/business-hours', businessHoursRoutes);
app.use('/api/calendar', calendarRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
