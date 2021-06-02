const express = require('express');
const connectDB = require('./config/db')

const app = express();

connectDB();

app.get('/', (req, res) => res.send('Yo efe'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`))