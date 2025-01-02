const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const userRoutes = require('./routes/userRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const userAuthenticationRoutes = require('./routes/authenticationRoute');
const emailRoutes = require('./routes/emailRoute');
const announcementRoutes = require('./routes/AnnouncementRoute');
const uploadRoutes = require('./routes/uploadRoutes');
const qrRoute = require('./routes/qrRoute'); 
const ballotRoute = require('./routes/BallotRoute');
const positionRoute = require('./routes/PositionRoute');
const candidateRoute = require('./routes/candidateRoute'); 
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/userRoles', userRoleRoutes);
app.use('/api/userAuthentication', userAuthenticationRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/qr', qrRoute);
app.use('/api/ballot', ballotRoute);
app.use('/api/position', positionRoute);
app.use('/api/candidate', candidateRoute);
// Test endpoint
app.get('/', (req, res) => {
  res.status(200).send("Hello World");
});

//http://localhost:5000/api/position/getAllPositions
//http://localhost:5000/api/position/createPosition

const db = require('./models/main');
db.sequelize.sync()
  .then(()=>console.log("Sync db."))
  .catch(err=>console.log("Failed: " + err.message))

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
