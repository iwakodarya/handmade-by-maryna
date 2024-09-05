const dotenv = require('dotenv');
dotenv.config();
const fetch = require("node-fetch");

// Global object to store googlePhotosData
const googlePhotosData = [];

// Authenticate and get Oath2 access token using refresh token
const getAccessToken = () => {
    return fetch('https://oauth2.googleapis.com/token',
        {
            method: 'POST',
            body: JSON.stringify({
                'client_id': process.env.CLIENT_ID,
                'client_secret': process.env.CLIENT_SECRET,
                'grant_type': 'refresh_token',
                'refresh_token': process.env.REFRESH_TOKEN,
                'redirect_uri': 'http://localhost:3000/'
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        },
    ).then(
        response => response.json()
    ).then(
        result => result.access_token
    ).catch(
        err => console.log('Error in getAccessToken:: ', err)
    );
};

// Get all mediaIds from a given album
const getAlbumPhotos = (albumId, accessToken) => {
    return fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({ 'albumId': albumId })
        }).then(
            
        )

};

// Get all albums in Google Photos
const getAllAlbums = (accessToken) => {
    return fetch('https://photoslibrary.googleapis.com/v1/albums',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
    ).then(
        response => response.json()
    )
        .then(
            result => {
                return result.albums.map(album => {
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
    const photos = await getAllAlbums(accessToken);
    console.log(photos)

    //for each ablum, fetch mediaIds from that album 

};

getPhotosFromGooglePhotosAPI()