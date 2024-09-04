const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

// Step 1) Authenticate and get Oath2 access token using refresh token

const getAccessToken = async () => {
    const accessToken = await axios.post('https://oauth2.googleapis.com/token',
        {
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": process.env.REFRESH_TOKEN,
            "redirect_uri": "http://localhost:3000/"
        },
        headers = {
            'Content-Type': 'application/json',
        },
    )
};

console.log(getAccessToken());