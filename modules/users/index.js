const express = require("express");
const mysql = require("mysql2");
const { v4: uuidv4 } = require('uuid');
const multer  = require("multer");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

const config = require('../../config/config.json');

const api = express.Router();

const upload = multer({dest:"uploads"});

const pool_creator =  mysql.createPool({
	connectionLimit: 1000,
	host: "127.0.0.1",
	user: config.database.user,
	database: "Dec-hack",
	password: config.database.password
});



function verify_token(req, res, next) {
	const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Токен не предоставлен' });
    }

    console.log(token);

    jwt.verify(token, config.auth.secret , (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Неверный токен' });
        }

        req.user_id = decoded.id;
        next();
    });
}


module.exports.verify_token = verify_token;


api.post("/", function (req, res) {
	if(!req.body){
		res.status(400)
		   .json({"error": {
		   		"text": "Haven`t data",
		   		"code": "001"	
		   }})
		   .end();
		return;
	}

	console.log(req.body);

	const sql_comm = `INSERT users(id, email, password, name, courses, my_courses, chatbots, image, image_type) VALUES (?,?,?,?,?,?,?,?,?)`;


	const user_id = uuidv4();

	let sql_data = [user_id, req.body.email, '', req.body.name, "{}", "{}", "{}" , "", ""]

	const salt = bcrypt.genSaltSync(config.auth.rounds);
	const password_hash = bcrypt.hashSync(req.body.password, salt);

	sql_data[2] = password_hash;

	pool_creator.query(sql_comm , sql_data , function(err_sql , data) {
		if(err_sql) {
			res.status(500)
			   .json({"error": {
			   		"text": "Error DB",
			   		"code": "002"	
			   }})
			   .end();
			   console.error(err_sql);
			return;	
		}

		res.status(201).json({"id": user_id}).end();
	});
});




api.post("/session", function (req, res) {
	if(!("email" in req.body) || !("password" in req.body)){
		res.status(400)
		   .json({"error": {
		   		"text": "Haven`t data",
		   		"code": "001"	
		   }})
		   .end();
		return;
	}

	const sql_comm = "SELECT id, email, password FROM users WHERE email = ?;";

	pool_creator.query(sql_comm , [ req.body.email ] , function(err_sql , data) {


		if( !bcrypt.compareSync(req.body.password, data[0].password) ) {
			res.status(400)
			   .json({"error": {
			   		"text": "Incorrect password",
			   		"code": "003"	
			   }})
			   .end();
			return;
		}


		
		var token = jwt.sign({ id: data[0].id }, config.auth.secret);
	
		res.status(201).json({ token }).end();
	});
});










// api.get('/auth/google', function (req, res) {
// 	const url = oauth2Client.generateAuthUrl({
// 		access_type: 'offline',
// 		scope: ['profile', 'email'],
// 	});
// 	res.redirect(url);
// });

// app.get('/auth/google/callback', function (req, res) {
// 	const code = req.query.code;

// 	if (code) {
// 		try {
// 			const { tokens } = await oauth2Client.getToken(code);
// 			oauth2Client.setCredentials(tokens);

// 			const ticket = await oauth2Client.verifyIdToken({
// 				idToken: tokens.id_token,
// 				audience: CLIENT_ID,
// 			});

// 			const payload = ticket.getPayload();
			

// 			const email = payload['email'];
// 			const name = payload['name'];

// 		} catch (error) {

// 		}
// 	} else {
// 		res.status(400).send('No code provided');
// 	}
// });


const client = new OAuth2Client(config.oauth_google.id);

// app.post('/auth/mobile/google', async function (req, res) {
// 	const { idToken } = req.body;

// 	try {
// 		const ticket = await client.verifyIdToken({
// 			idToken,
// 			audience: config.oauth_google.id,
// 		});

// 		const payload = ticket.getPayload();
// 		const { sub, email, name } = payload;

// 		const sql_comm = "SELECT id FROM users WHERE email = ?;";

// 		pool_creator.query(sql_comm , [ email ] , function(err_sql , data) {
// 			if( !bcrypt.compareSync(req.query.password, password) ) {
// 				res.status(400)
// 				   .json({"error": {
// 				   		"text": "Incorrect password",
// 				   		"code": "003"	
// 				   }})
// 				   .end();
// 				return;
// 			}
		
// 			if(data.lenght == 0) {
// 				const user_id = uuidv4();

// 				const sql_comm2 = "INSERT users(id, email, password, name, courses, my_courses, chatbots) VALUES (?,?,?,?,?,?);";

// 				let sql_data = [user_id, req.body.email, 'GOOGLE', req.body.name, "{}", "{}", "{}"]

// 				pool_creator.query(sql_comm2 , sql_data , function(err_sql , data) {
// 					if(err_sql) {
// 						res.status(500)
// 						   .json({"error": {
// 						   		"text": "Error DB",
// 						   		"code": "002"	
// 						   }})
// 						   .end();
// 						return;	
// 					}
// 				});

// 				const token = jwt.sign({ "id": user_id }, JWT_SECRET);

// 				res.json({ token });

// 			}

// 			const token = jwt.sign({ "id": data[0].id }, JWT_SECRET);
// 			res.json({ token });

// 		});
// 	} catch (error) {
// 		res.status(400)
// 		   .json({"error": {
// 		   		"text": "Invalid token",
// 		   		"code": "006"	
// 		   }})
// 		   .end();
// 		return;
// 	}
// });

api.post('/auth/mobile/google', async function (req, res) {
	const { idToken } = req.body;

	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: config.oauth_google.id,
		});

		const payload = ticket.getPayload();
		const { sub, email, name } = payload;

		const sql_comm = "SELECT id FROM users WHERE email = ?;";

		pool_creator.query(sql_comm, [email], function(err_sql, data) {
			if (err_sql) {
				res.status(500).json({ error: { text: "Database error", code: "002" }}).end();
				return;
			}

			if (data.length === 0) {
				const user_id = uuidv4();
				const sql_comm2 = "INSERT INTO users(id, email, password, name, courses, my_courses, chatbots) VALUES (?, ?, 'GOOGLE', ?, ?, ?, ?);";

				let sql_data = [user_id, email, name, "{}", "{}", "{}"];

				pool_creator.query(sql_comm2, sql_data, function(err_sql) {
					if (err_sql) {
						res.status(500).json({ error: { text: "Database error", code: "002" }}).end();
						return;	
					}
				});

				const token = jwt.sign({ id: user_id }, config.auth.secret);
				res.json({ token });

			} else {
				const token = jwt.sign({ id: data[0].id }, config.auth.secret);
				res.json({ token });
			}
		});
	} catch (error) {
		res.status(400)
		   .json({"error": {
		   		"text": "Invalid token",
		   		"code": "006"	
		   }})
		   .end();
	}
});







// api.delete("/session", function (req, res) {
// });


// api.delete("/", function (req, res) {
// }); 




api.get("/@me", verify_token, function (req, res) {
	const sql_comm = "SELECT * FROM users WHERE id = ?;";

	pool_creator.query(sql_comm, [ req.user_id ], function(err_sql, data) {
		if (err_sql || data.length === 0) {
			res.status(404)
			   .json({"error": {
			   		"text": "User not found",
			   		"code": "004"	
			   }})
			   .end();
			return;
		}

		res.status(200).json(data[0]).end();
	});
});

module.exports.api = api;