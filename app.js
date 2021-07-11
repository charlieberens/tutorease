// require('dotenv').config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./MERN Question Serving Server/config/connect_db');
const cors = require('cors')
const cookieSession = require('cookie-session');
const passport = require('passport');
// const keys = require('./MERN Question Serving Server/config/keys')
require('./MERN Question Serving Server/passport');

const app = express();

connectDB(); //Connects to the database using the connect_db.js folder

// Passport Config
app.use(cookieSession({
  name: 'session-name',
  keys: [process.env.SECRET]
}))

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

// Triggers this JSON reading package on all posts
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './MERN Question Serving Client/mern_question_serving_client/build')));

// BTS GET/POST endpoints. Endpoints will begin with /api/
const tutorRoute = require('./MERN Question Serving Server/routes/tutors.js');
const userRoute = require('./MERN Question Serving Server/routes/users.js');
const studentRoute = require('./MERN Question Serving Server/routes/students.js');
const authRoute = require('./MERN Question Serving Server/routes/auth.js');

// Directs these endpoints to the files in /routes
// The endpoint refers to the DB used, not the data wanted
app.use('/api/tutors', tutorRoute);
app.use('/api/users', userRoute);
app.use('/api/students', studentRoute);
app.use('/auth', authRoute);

// Temporary base url
// app.get('/', (req, res) => res.send('Yo efe'));
app.get('/*', (req,res) =>{
    res.sendFile(path.join(__dirname, './MERN Question Serving Client/mern_question_serving_client/build/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`))
