const express = require('express');
const DB = require('better-sqlite3');
const config = require('./config');

const app = express();
const db = new DB(config.db);

app.set('views', __dirname);
app.set('view engine', 'pug');

try {
	db.exec('SELECT EXISTS(SELECT 1 FROM links)');
} catch(e) {
	db.exec(`
		CREATE TABLE links (
			name TEXT PRIMARY KEY,
			dest TEXT
		)
	`);
}

const getLink = db.prepare(`
	SELECT dest
	FROM links
	WHERE name = ?
`);
getLink.pluck();

app.get('/', (req, res) => {
	const matched = config.linkregex.exec(req.hostname);
	if(!matched) return res.status(400).render('error', {
		msg: 'Invalid url'
	});
	const [, match] = matched;
	const link = getLink.get(match);
	if(!link) return res.status(404).render('error', {
		msg: 'No link for this url'
	});
	res.redirect(link);
});

app.listen(config.port, () => {
	console.log('App ready');
});
