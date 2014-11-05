var express = require('express')
var mongoose = require('mongoose');

//MONGOOSE DB Configuration
mongoose.connect('mongodb://localhost/user');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
  console.log('Connected to Mongo!')
});

var userSchema = mongoose.Schema({
    name: String
})

var User = mongoose.model('User', userSchema)

//EXPRESS REST Methods
var app = express()

app.get('/contact/list', function (req, res) {

	console.log('listando todos os usuários')
	
	User.find({}, function(err, users){
    	if(err){
			console.error('ERROR: '+err)
		}else{
			console.log('USERS: '+users)
			res.send(users)
		}
	})

})

app.get('/contact/find/:name', function (req, res) {

	console.log('consultando por nome: ['+req.params.name+']')
	
	var query = User.find({'name' : req.params.name})

	query.exec(function (err, users){
		if(err){
			console.error('ERROR: '+err)
		}else{
			console.log('USERS: '+users)
			res.send(users)
		}
	})
})

app.get('/contact/:id', function (req, res) {
	var query = User.findOne({'_id' : req.params.id})
	console.log('consultando por Id: ['+req.params.id+']')
	query.exec(function (err, user){

		if(err){

			console.error('ERROR: '+err)
		}else{

			if(user == null){
				console.log("usuário não encontrado.")
				user = new Object()
			}else{
				console.log('USER: '+user);
				res.send(user);		
			}
		}
	})
})

app.post('/contact/:name', function (req, res) {
	var user = new User({name : req.params.name})
	user.save(function(err, user){
		if(err){
			console.error('ERROR: '+err)
		}else{
			res.send(user);
		}
	})
})

app.post('/contact/:id/:name', function (req, res) {

	User.findOneAndUpdate({'_id':req.params.id}, {'name':req.params.name}, function(err, user){
		if(err){
			console.log(err)
		}else{

			if(user == null){
				user = new Object()
			}
			res.send(user)
		}
	})
})


app.delete('/contact/:id', function (req, res) {

	User.remove({ '_id': req.params.id }, function (err) {
  		if (err){
  			console.log(err);	
  		}else{
  			var success = {result : 'success'}
  			res.send(success);
  		}
	});
})

//HTTP SERVER CONFIGURATION
var server = app.listen(3000, function () {

	var host = server.address().address
	var port = server.address().port

console.log('ContactApp escutando requisições em http://%s:%s', host, port)
})