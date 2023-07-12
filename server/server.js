// IMPORTS
require('dotenv').config();
const express = require('express');
const app = express();
const knex = require('knex');
const db = require('./connectors/db');
const bodyParser = require('body-parser');

const cors = require('cors');
app.use(cors());


const shorten = require('./routes/shorten.js');
shorten(app);
// HANDLE IF WE DID NOT FIND THE ROUTE WE WERE LOOKING FOR
app.use(function (req, res, next) {
	return res
		.status(404)
		.send('----------  ERROR COULD NOT FIND YOUR SPECIFIED ROUTE/PAGE  -----------');
});

// START SERVER
app.listen(3000, () => {
	console.log('Server is now listening at port 3000 on http://localhost:3000/');
});