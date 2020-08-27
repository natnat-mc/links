# links
A smol barebones redirection server, based on domain instead of path

## What does it do?
You go to `something.x.domain.tld`, and it redirects you to whatever URL is in its database for this domain.  
You need a wildcard DNS for this, and while you can run this on port 80, I personally run this behind h2o as reverse proxy to get SSL to work

## It really justs redirects based on a database, that's it?
For now, yes, it just reads its redirection in a SQLite database. If you want to add or change redirections, you need to edit the database yourself.  
In the future, I'll probably add a config interface that handles this for you, and maybe even an API.

## How do I install this?
- get nodejs and npm
- get this repo
- `npm i`
- copy `config-example.js` to `config.js` and tweak this to fit your needs
- do whatever you need to get a wildcard DNS pointing to your sever and a wildcard certificate
- setup a reverse proxy to redirect the wildcard to this server, and forward the `Host` header
- run this server with `node index.js`
- that's it
