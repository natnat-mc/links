const {app} = require('.');

app.get('/', (req, res) => {
	res.render('index');
});
