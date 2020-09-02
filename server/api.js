const {Router} = require('express');
const {verify} = require('argon2');
const {promisify} = require('util');
const randomBytes = promisify(require('crypto').randomBytes);

const {app, config, db} = require('.');

const api = Router();
app.use('/api', api);

try {
	db.exec('SELECT EXISTS(SELECT 1 FROM tokens)');
} catch(e) {
	db.exec(`
		CREATE TABLE tokens (
			token TEXT PRIMARY KEY,
			perms INTEGER
		)
	`);
}

const getTokenPerms = db.prepare(`
	SELECT perms
	FROM tokens
	WHERE token = ?
`);
getTokenPerms.pluck();

const insertToken = db.prepare(`
	INSERT
	INTO tokens(token, perms)
	VALUES(?, ?)
`);

const deleteToken = db.prepare(`
	DELETE
	FROM tokens
	WHERE token = ?
`);

const listLinks = db.prepare(`
	SELECT name, dest
	FROM links
`);

const getLink = db.prepare(`
	SELECT dest
	FROM links
	WHERE name = ?
`);
getLink.pluck();

const insertLink = db.prepare(`
	INSERT
	INTO links(name, dest)
	VALUES(?, ?)
`);

const updateLink = db.prepare(`
	UPDATE links
	SET dest = ?
	WHERE name = ?
`);

const deleteLink = db.prepare(`
	DELETE
	FROM links
	WHERE name = ?
`);

const perms = {
	read:   0x01,
	write:  0x02,
	all:    0xff
};
const usePerms = (...requiredPerms) => (req, res, next) => {
	const permValue = requiredPerms.map(x => perms[x]).reduce((a, b) => a+b, 0);
	const token = req.headers.token;
	if(!token) return res.status(401).json({
		ok: false,
		error: "Must use a Token header"
	});

	const actualPerms = getTokenPerms.get(token);
	if(actualPerms===undefined) return res.status(401).json({
		ok: false,
		error: "Invalid token"
	});
	if((actualPerms&permValue)!==permValue) return res.status(401).json({
		ok: false,
		error: "Token doesn't have sufficient permissions"
	});

	req.token = token;
	return next();
};

api.post('/login', async (req, res) => {
	if(!Array.isArray(req.body.permissions) || typeof req.body.permissions[0]!=='string' || typeof req.body.password!=='string') {
		return res.status(400).json({
			ok: false,
			error: "Invalid body"
		});
	}

	let permissionValue = 0;
	for(let p of req.body.permissions) {
		let value = perms[p];
		if(typeof value!=='number') {
			return res.status(400).json({
				ok: false,
				error: `Invalid permission: ${p}`
			});
		}
		permissionValue |= value;
	}

	if(!await verify(config.argon2hash, req.body.password)) {
		return res.status(401).json({
			ok: false,
			error: "Invalid password"
		});
	}

	const bytes = (await randomBytes(32)).toString('base64');
	insertToken.run(bytes, permissionValue);
	res.json({
		ok: true,
		token: bytes
	});
});

api.post('/logout', usePerms(), (req, res) => {
	deleteToken.run(req.token);
	res.json({
		ok: true
	});
});

api.get('/links', usePerms('read'), (req, res) => {
	let links = {};
	for(let {name, dest} of listLinks.all()) links[name] = dest;
	res.json({
		ok: true,
		links
	});
});

api.get('/fixedUrl', (req, res) => {
	res.json({
		ok: true,
		url: config.fixedUrl
	});
});

api.get('/links/:name', usePerms('read'), (req, res) => {
	let dest = getLink.get(req.params.name);
	if(!dest) return res.status(404).json({
		ok: false,
		error: "No such link"
	});
	res.json({
		ok: true,
		link: dest
	});
});

api.delete('/links/:name', usePerms('write'), (req, res) => {
	if(!deleteLink.run(req.params.name).changes) return res.status(404).json({
		ok: false,
		error: "No such link"
	});
	res.json({
		ok: true
	});
});

api.put('/links/:name', usePerms('write'), (req, res) => {
	if(typeof req.body.link!=='string') return res.status(400).json({
		ok: false,
		error: "Invalid body"
	});
	if(!updateLink.run(req.body.link, req.params.name).changes) insertLink.run(req.params.name, req.body.link);
	res.json({
		ok: true
	});
});
