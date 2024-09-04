const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

// Global object to store googlePhotosData
const googlePhotosData = [];

// Authenticate and get Oath2 access token using refresh token
const getAccessToken = () => {
    return axios.post('https://oauth2.googleapis.com/token',
        {
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
            'grant_type': 'refresh_token',
            'refresh_token': process.env.REFRESH_TOKEN,
            'redirect_uri': 'http://localhost:3000/'
        },
        headers = {
            'Content-Type': 'application/json',
        },
    ).then(
        response => response.data.access_token
    ).catch(
        err => console.log('Error in getAccessToken:: ', err)
    );
};

// Get all albums in Google Photos
const getAllAlbums = (accessToken) => {
    return axios.get('https://photoslibrary.googleapis.com/v1/albums',
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    ).then(
        response => {
            return response.data.albums.map(album => {
                return ({
                    'album_id': album.id,
                    'album_name': album.title
                })
            })
        }
    ).catch(err => console.log('Error in getAllAlbums::', err))
}

// Get Google photos albums and mediaIds from 
const getPhotosFromGooglePhotosAPI = async () => {
    const accessToken = await getAccessToken();
    // 1) Get all albums 
    const albums = await getAllAlbums(accessToken);
    console.log(albums)
};

getPhotosFromGooglePhotosAPI()