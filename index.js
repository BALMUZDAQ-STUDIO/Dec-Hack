const express = require("express");
const cors = require("cors");
const session = require('express-session');

const config = require('./config/config.json');

const users = require('./modules/users');
const courses = require('./modules/courses');

const app = express();

//- Test log func
app.use(function(req , res , next){
	let date = new Date();
	console.log(`${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}\t\t${req.ip}\t${req.method}\t${req.url}`);
	console.log(req.cookies);
	next();
});

// const sessionStore = new MySQLStore(options);

// app.use(session({
// 	key: 'session',
// 	secret: '12345678dsc',
// 	store: sessionStore,
// 	resave: false,
// 	saveUninitialized: false
// }));

// sessionStore.onReady().then(() => {
// 	console.log('MySQLStore ready');
// }).catch(error => {
// 	console.error(error);
// });


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());




const app_API = express.Router();
const api_v1 = express.Router();

api_v1.use("/users" , users.api);
api_v1.use("/courses" , courses.api);

app_API.use("/v1" , api_v1);
app.use("/api" , app_API);


app.listen(config.server.port , config.server.host);