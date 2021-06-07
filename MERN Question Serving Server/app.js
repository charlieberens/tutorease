const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./connect_db');
const cors = require('cors')

const app = express();

connectDB(); //Connects to the database using the connect_db.js folder

// Triggers this JSON reading package on all posts
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../MERN Question Serving Client/mern_question_serving_client/build')));

// BTS GET/POST endpoints. Endpoints will begin with /api/
const questionRoute = require('./routes/questions.js');
// const qsetRoute = require('./routes/qsets.js');
const tutorRoute = require('./routes/tutors.js');

// Directs these endpoints to the files in /routes
// The endpoint refers to the DB used, not the data wanted
app.use('/api/questions', questionRoute);
// app.use('/api/qsets', qsetRoute);
app.use('/api/tutors', tutorRoute);

// Temporary base url
// app.get('/', (req, res) => res.send('Yo efe'));
app.get('/*', (req,res) =>{
    res.sendFile(path.join(__dirname, '../MERN Question Serving Client/mern_question_serving_client/build/index.html'));
});






const port = 3000;

app.listen(port, () => console.log(`Server running on port ${port}`))