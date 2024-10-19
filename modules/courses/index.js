const express = require("express");
const mysql = require("mysql2");
const { v4: uuidv4 } = require('uuid');
const multer  = require("multer");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Fuse = require('fuse.js');


const verify = require('../users').verify_token;

const config = require('../../config/config.json');

const ai_gen = require("./dist/call-all");

const api = express.Router();

const upload = multer({dest:"uploads"});


const pool_creator =  mysql.createPool({
	connectionLimit: 1000,
	host: "127.0.0.1",
	user: config.database.user,
	database: "Dec-hack",
	password: config.database.password
});



api.get('/' , verify, function (req, res) {
	if( !("i_start" in req.query) && !("i_end" in req.query) ) {
		res.status(400)
		   .json({"error": {
		   		"text": "Haven`t data",
		   		"code": "001"	
		   }})
		   .end();
		return;
	} 

	let search = null;

	if("search" in req.query) search = req.query.search;

	const sql_comm = `SELECT id , name , about FROM courses LIMIT  ${req.query.i_start}, ${req.query.i_end};`;


	pool_creator.query(sql_comm , [] , function(err_sql , data) {
		if( err_sql ) {
			res.status(400)
			   .json({"error": {
			   		"text": "DB error",
			   		"code": "007"
			   }})
			   .end();
			console.log(err_sql);
			return;
		}

		console.log(data);

		if(data.length == 0) {
			res.status(201).json({}).end();
			return;
		}

		if(search == null) {
			res.status(201).json(data).end();
			return;
		}

		const options = {
			includeScore: true,
			keys: ['id', 'name', 'about']
		};



		const fuse = new Fuse(data, options);

		console.log(fuse);

		const result = fuse.search(search);

		result.sort( (a ,b) => a.score - b.score );

		result.forEach( n => n.item );

		res.status(201).json({ result }).end();
	});
});


api.get('/:id' , verify, function (req, res) {
	const sql_comm = "SELECT * FROM courses WHERE id = ?;";

	pool_creator.query(sql_comm, [ req.params.id ], function(err_sql, data) {
		if (err_sql || data.length === 0) {
			res.status(404)
			   .json({"error": {
			   		"text": "Course not found",
			   		"code": "004"	
			   }})
			   .end();
			return;
		}

		res.status(200).json(data[0]).end();
	});
});


api.get('/:id/image' , function (req, res) {
	const sql_comm = "SELECT image, image_type FROM courses WHERE id = ?;";

	pool_creator.query(sql_comm, [ req.params.id ], function(err_sql, data) {
		if (err_sql || data.length === 0) {
			res.status(404)
			   .json({"error": {
			   		"text": "Course not found",
			   		"code": "004"	
			   }})
			   .end();
			return;
		}
		const imgBuffer = Buffer.from(data[0].image, 'base64');

		res.setHeader('Content-Type', `image/${data[0].image_type}`);

		res.send(imgBuffer).end();
	});
});



// function gen_image(promt, anti_promt) {
// 	const params = {
// 		type: "GENERATE",
// 		style: "DEFALUT",
// 		width: 2400,
// 		height: 1600,
// 		num_images: 1,
// 		negativePromptUnclip: anti_promt,
// 		generateParams: {
// 			query: promt,
// 		}
// 	}

// 	const headers = {
// 		'X-Key': `Key ${config.image_gen.token}`,
// 		'X-Secret': `Secret ${config.image_gen.secret}`
// 	}


// 	let model_id = 0;
// 	{
// 		let res = await fetch('https://api-key.fusionbrain.ai/key/api/v1/models', {
// 			method: 'GET',
// 			headers: headers
// 		});
// 		res = await res.json();
// 		model_id = res[0].id;
// 	}

// 	let formData = new FormData();
// 	formData.append('model_id', model_id);
// 	formData.append('params', new Blob([JSON.stringify(params())], { type: "application/json" }));

// 	let res = await fetch('https://api-key.fusionbrain.ai/key/api/v1/text2image/run', {
// 		method: 'POST',
// 		headers: headers(),
// 		body: formData,
// 	});
// 	let json = await res.json();
// 	console.log(json);

// 	uuid = json.uuid;

// 	let image = 0;

// 	while(1){
// 		if(image != 0) {
// 			break;
// 		}

// 		setTimeout(() => {
// 			let res = await fetch('https://api-key.fusionbrain.ai/key/api/v1/text2image/status/' + uuid, {
// 				method: 'GET',
// 				headers: headers,
// 			});
// 			let json = await res.json();

// 			switch (json.status) {
// 				case 'INITIAL':
// 				case 'PROCESSING':
// 					break;

// 				case 'DONE':
// 					image = json.images[0];
// 					break;

// 				case 'FAIL':
// 					image = "error";
// 					break;
// 			}
// 		}, 3000);

// 	}

// 	return { "data": image , "mime": "jpg"};
// }


api.post("/", verify, function(req, res) {
	// let content_data = req.file;
	console.log(content_data);
	
	if(!("books" in req.body)){
		res.status(400)
		   .json({"error": {
		   		"text": "Haven`t data",
		   		"code": "001"
		   }})
		   .end();
		return;
	}
	if(!("description" in req.body)){
		res.status(400)
		   .json({"error": {
		   		"text": "Haven`t data",
		   		"code": "001"
		   }})
		   .end();
		return;
	}
	if(!("settings" in req.body)){
		res.status(400)
		   .json({"error": {
		   		"text": "Haven`t data",
		   		"code": "001"
		   }})
		   .end();
		return;
	}

	// let data = fs.readFileSync(`/upload/${req.params.id}`, {encoding:"base64"});
	let books = books;

	const options = {
		hostname: config.ai.host,
		port: config.ai.port,
		path: config.ai.path,
		method: "POST",
		body: JSON.stringify({
			"api-key": ai_api_key,
			"books": books,
			"description": description,
			"settings": settings
		})
	};

	let course_data = {};
	let image_course = {};

	const ai_req = https.request(options, (res) => {
		if(res.statusCode !== 201) {
			console.error("Error get session!");
		}

		res.on('data', (d) => {
			let data = JSON.parse(d);
			if(!d) {
				console.error("havent data in contest!");
			}

			course_data = data.course;
		});
	});
	ai_req.on('error', (e) => {
		console.error(e);
	});
	ai_req.end(() => {

		if(req.body.ai_image == true) {
			image_course = gen_image(course_data.promt_ai_image);
		} else {
			image_course.data = req.body.course_image.data;
			image_course.mime = req.body.course_image.mime;
		}


	});
});



api.patch("/:id/join", verify, function (req, res){
	const sql_comm = "SELECT courses FROM users WHERE id = ?;";

	pool_creator.query(sql_comm , [ req.user_id ] , function(err_sql , data) {
		if(err_sql) {
			res.status(500)
			   .json({"error": {
			   		"text": "Error DB",
			   		"code": "002"	
			   }})
			   .end();
			return;	
		}
	
		if(req.params.id in data[0].courses) {
			res.status(400)
			   .json({"error": {
			   		"text": "Already on the course",
			   		"code": "007"	
			   }})
			   .end();
			return;
		}

		data[0].courses[req.params.id] = {
			"progress": 0,
			"last-lesson": 1,
			"last-time": moment().format("YYYY-MM-DD  HH:mm:ss.000")
		}

		const sql_comm2 = "UPDATE users SET сourses = ? WHERE id = ?;";

		pool_creator.query(sql_comm2 , [ data[0].courses, req.user_id ] , function(err_sql , data) {
			if(err_sql) {
				res.status(500)
				   .json({"error": {
				   		"text": "Error DB",
				   		"code": "002"	
				   }})
				   .end();
				return;	
			}

			res.status(200).end();
		});

	});
});



module.exports.api = api;