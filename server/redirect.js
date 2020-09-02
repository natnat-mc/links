const {app, config, db} = require('.');

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

app.get('/', (req, res, next) => {
	const matched = config.linkregex.exec(req.hostname);
	if(!matched) return next();
	const [, match] = matched;
	const link = getLink.get(match);
	if(!link) return res.status(404).render('error', {
		msg: 'No link for this url'
	});
	res.redirect(link);
});
