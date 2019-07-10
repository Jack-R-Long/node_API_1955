// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
//mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
// create the express app
var app = express();
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.json());
// MiddleWare: Session and Flash 
var session = require('express-session');
app.use(session({
	secret: 'cam_god',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
const flash = require('express-flash');
app.use(flash());
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// // Get sockets
// const server = app.listen(8000);
// const io = require('socket.io')(server);
// var counter = 0;

// io.on('connection', function (socket) { //2
// 	  //Insert SOCKETS 
// });

// Mongoose Schema users 
var PeopleSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 2},
}, {timestamps: true})
mongoose.model('People', PeopleSchema); // We are setting this Schema in our Models as 'People'
var People = mongoose.model('People') // We are retrieving this Schema from our Models, named 'User'

// // ...delete all records of the User Model
// User.deleteMany({}, function(err){
// 	// This code will run when the DB has attempted to remove all matching records to {}
//    })

// root route to render the index.ejs view
app.get('/', function(req, res) {
	People.find({}, function(err, peoples_array) {
		if (err) {
			console.log("Error finding Peoples")
			res.json({message: "Error", error: err})
		}else {
			console.log(peoples_array)
			res.json({message: "Success", data: peoples_array})
		}
	})
})
// create new user 
app.get('/new/:name', (req, res)=> {
	People.create({name: req.params.name}, (err, new_person_arr)=> {
		if (err) {
			console.log("Error creating person")
			res.json({message: "Error", error: err})	
		}else {
			console.log(new_person_arr)
			res.json({message: "Success", data: new_person_arr})
		}
	})
})
// delete new people 
app.get('/remove/:name', (req, res)=> {
	People.deleteOne({name: req.params.name}, (err) => {
		if (err) {
			console.log("Error deleting person")
			res.json({message: "Error", error: err})	
		}else {
			res.json({message: "Success"})
		}
	})
})
// show person 
app.get('/:name', (req, res)=> {
	People.findOne({name: req.params.name}, (err, person_arr)=> {
		if (err) {
			console.log("Error finding Person")
			res.json({message: "Error", error: err})
		}else {
			console.log(person_arr)
			res.json({message: "Success", data: person_arr})
		}
	})
})


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(request, response){
	response.send("404")
});

// tell the express app to listen on port 8000
app.listen(8000, function() {
 console.log("listening on port 8000");
});