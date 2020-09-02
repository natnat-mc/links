module.exports = {
	port: 8080,
	linkregex: /(.+)\.l\.domain\.tld$/,
	fixedUrl: '.l.domain.tld',
	db: 'links.db',
	argon2hash: '$argon2i$v=19$m=4096,t=3,p=1$1KSDhG+iS0zEuffsmjARHA$IUsGujPb4Lxl39UdWzrJDIdhMAaGoQ5hUVPBeqqGx9I' // 'changeme'
};
