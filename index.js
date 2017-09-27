// express
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
//app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/index.html',function(request, response) {
    'use strict';
  response.sendFile( __dirname  + '/index.html');
});


// sqlite3
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

// sqlite3 initialisation
const initialUsers = ["Bonjour","Comment tu vas ?"]
db.serialize(() => {
	db.run("CREATE TABLE Message (id INTEGER PRIMARY KEY AUTOINCREMENT, test TEXT NOT NULL)")

	db.parallelize(() => {
		const stmt = db.prepare("INSERT INTO Message (texte) VALUES (?)")
		initialUsers.forEach(userName => stmt.run(userName))
		stmt.finalize()
	})
})

// containts
const makeWS = (method, path, callback) => app[method](path, (req, res) =>{
	res.setHeader('Content-Type', 'application/html');
	callback(req,res)
})
const returnInternalError = (res, err) => {
	res.sendStatus(500)
	console.error(err)
}

// webservices
app.get('/index.html', function(request, response) {
  var message = request.param("message"); 
  console.log(message);
  response.sendFile( __dirname  + '/index.html');
});


makeWS('get', '/message', (req, res) => {
	db.all("SELECT id, texte FROM Message", (err, rows) => {
		if(err)
			returnInternalError(res, err)
		else
			res.send(rows)
	})
})


// starting server
app.listen(3000, function () {
	console.log('Test app running on the 3000 port')
})

// closing server
process.on('exit', function() {
	db.close()
})
