# links
A smol barebones redirection server, based on domain instead of path

## What does it do?
You go to `something.x.domain.tld`, and it redirects you to whatever URL is in its database for this domain.  
You need a wildcard DNS for this, and while you can run this on port 80, I personally run this behind h2o as reverse proxy to get SSL to work.  
There's also an API on `/api` (see `server/api.js` for details until there's an API documentation) and a config interface on every domain that doesn't match the regexp.  
There's also a config interface on the same domains than the API.

## How do I install this?
- get nodejs and npm
- get this repo
- `npm i`
- copy `config-example.js` to `config.js` and tweak this to fit your needs
- do whatever you need to get a wildcard DNS pointing to your sever and a wildcard certificate
- setup a reverse proxy to redirect the wildcard to this server, and forward the `Host` header
- run this server with `node server`
- that's it

## How do I modify this?
- modify the code
- `npm run build`
- restart the server
