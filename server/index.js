const express = require('express');
const DB = require('better-sqlite3');
const config = require('../config');

const app = express();
const db = new DB(config.db);

app.set('views', __dirname);
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.static(__dirname+'/../dist'));

exports.app = app;
exports.config = config;
exports.db = db;

require('./redirect');
require('./api');
require('./client');

app.listen(config.port, () => {
	console.log('Redirect app ready');
});
