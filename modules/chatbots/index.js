const express = require("express");
const mysql = require("mysql2");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { Configuration, OpenAIApi } = require('openai');

const config = require('../../config/config.json');
const verify = require('../users').verify_token;

const api = express.Router();


const openai = new OpenAIApi(new Configuration({
	apiKey: config.openai.api_key,
}));

const pool_creator = mysql.createPool({
	connectionLimit: 1000,
	host: "127.0.0.1",
	user: config.database.user,
	database: "Dec-hack",
	password: config.database.password
});


api.post("/chatbots", verify, (req, res) => {
	if (!req.body || !req.body.name || !req.body.prompt) {
		return res.status(400)
			.json({ error: { text: "Haven't data", code: "001" } })
			.end();
	}

	const bot_id = uuidv4();
	const sql_comm = `INSERT INTO chatbots(id, user_id, name, prompt, created_at) VALUES (?,?,?,?,NOW())`;

	const sql_data = [bot_id, req.user_id, req.body.name, req.body.prompt];

	pool_creator.query(sql_comm, sql_data, (err_sql) => {
		if (err_sql) {
			return res.status(500)
				.json({ error: { text: "Error DB", code: "002" } })
				.end();
		}

		res.status(201).json({ id: bot_id }).end();
	});
});


api.get("/chatbots", verify, (req, res) => {
	const sql_comm = "SELECT * FROM chatbots WHERE user_id = ?";

	pool_creator.query(sql_comm, [req.user_id], (err_sql, data) => {
		if (err_sql || data.length === 0) {
			return res.status(404)
				.json({ error: { text: "No chatbots found", code: "003" } })
				.end();
		}

		res.status(200).json(data).end();
	});
});


api.post("/chatbots/:id/ask", verify, async (req, res) => {
	if (!req.body || !req.body.message) {
		return res.status(400)
			.json({ error: { text: "No message provided", code: "001" } })
			.end();
	}

	const sql_comm = "SELECT prompt FROM chatbots WHERE id = ? AND user_id = ?";

	pool_creator.query(sql_comm, [req.params.id, req.user_id], async (err_sql, data) => {
		if (err_sql || data.length === 0) {
			return res.status(404)
				.json({ error: { text: "Chatbot not found", code: "004" } })
				.end();
		}

		const bot_prompt = data[0].prompt;
		const user_message = req.body.message;

		try {
			const response = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: `${bot_prompt}\nUser: ${user_message}\nBot:`,
				max_tokens: 150,
				temperature: 0.7,
			});

			res.status(200).json({ reply: response.data.choices[0].text.trim() }).end();
		} catch (error) {
			res.status(500)
				.json({ error: { text: "OpenAI request failed", code: "005" } })
				.end();
		}
	});
});


api.delete("/chatbots/:id", verify, (req, res) => {
	const sql_comm = "DELETE FROM chatbots WHERE id = ? AND user_id = ?";

	pool_creator.query(sql_comm, [req.params.id, req.user_id], (err_sql, data) => {
		if (err_sql || data.affectedRows === 0) {
			return res.status(404)
				.json({ error: { text: "Chatbot not found", code: "004" } })
				.end();
		}

		res.status(200).json({ message: "Chatbot deleted" }).end();
	});
});

module.exports.api = api;