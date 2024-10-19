![Logo](https://raw.githubusercontent.com/BALMUSDAQ-STUDIO/Balmuzdaq-logos/refs/heads/main/Balmuz_logo_1.png)

<h1 align="center">CourseFusion Backend</h1>

<img src="https://raw.githubusercontent.com/BALMUSDAQ-STUDIO/Balmuzdaq-logos/refs/heads/main/Снимок%20экрана%202024-09-28%20в%2019.24.10.png" alt="Alt text" width="400" align="right"/>



<span>CourseFusion Backend is a web server written in NodeJS & ExpressJS. This server is the universal core of the system, on the basis of which you can write any frontend using the RestAPI that it provides.<br>The database is a MySQL Community Server.</span>

 **Features**

- **Generate Image for Courses**: Generating images for courses.
- **AI Generate Courses**: Generating courses based on textbooks or other electronic materials.
<!-- - **Generate test**: The bot uses Google Text-to-Speech (gTTS) to convert supportive messages into voice responses for users. -->
- **AI Assistance**: An AI bot that helps in learning and can answer any question.

## Tech Stack

- **JavaScript**: Main programming language used to develop the server.
  - **ExpressJS**: this is a JS framework for programming web applications.
  - **MySQL**: Converts text-based messages into voice format for users who prefer listening.
- **OpenAI API**: Powers the AI-drien conversations, providing empathetic and context-aware responses to users.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/BALMUSDAQ-STUDIO/Dec-hack.git
    cd Dec-hack
    ```

2. Install required dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables:
    - Open a `config/config.json` file with the following variables:
        - `server`: 
            - `host`: IP which server will be listening to.
            - `host`: Port which server will be listening to.
        - `oauth_google`:
            - `id`: client ID from Google API Console
            - `secret`: secret key from Google API Console
            - `redirect_url`: URL for callback Google API (Use default option)
        - `auth`:
            - `rounds`: counts of rounds for gen salt(bcrypt). The more rounds the harder it is to crack, but the generation is longer.
            - `secret`: secret for generate JWT tokens.
        - `database`: 
            - `user`: user`s login for access MySQL databsase
            - `password`: user`s password for MySQL
        - `image_gen`: 
            - `token`: the service token for generating images (Fusion Brain API / Kandinsky 3.1)
            - `secret`: the secret key for service
        - `ai`: 
            - `token`: secret token for OpenAI API service
  
    Example:
    ```env
    {
        "server": {
            "host": "server_ip",
            "port": server_port
        },
        "oauth_google": {
            "id": "account_google_api_ID",
            "secret": "account_google_api_secret",
            "redirec_url": "/api/v1/users/oauth/google"
        },
        "auth": {
            "rounds": count_rounds,
            "secret": "string_secret"
        },
        "database": {
            "user": "login_MySQL",
            "password": "password_MySQL"
        },
        "image_gen": {
            "token": "token_api_kandinsky",
            "secret": "secret_api_kandinsky"
        },
        "ai": {
            "token": "openai_api_token"
        }
    }
    ```

4. Run the bot:

    ```bash
    npm run dev
    ```

## Key Files

- `index.js`: The file were asseblity API.
- `modules/courses/index.js`: API for courses.
- `modules/users/index.js`: API for users.
- `modules/chatbots/index.js`: API for chatbots.



## Contributing

Contributions are welcome! Please fork the repository, create a new branch for your features or bug fixes, and submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull 


## Authors

- [@DeadSmileCode](https://www.github.com/DeadSmileCode)
- [@RuslanAmirov](https://github.com/tengri)


## Feedback

If you have any feedback, please reach out to us at balmuzdaq.studio@gmail.com


## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.