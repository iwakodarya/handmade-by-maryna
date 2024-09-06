import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Amazon AWS S3
import {
    S3Client,
    PutObjectCommand
} from "@aws-sdk/client-s3";

dotenv.config();

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
            response => response.json()
        ).then(
            result => {
                if (result.mediaItems) {
                    return result.mediaItems.map(item => {
                        return ({
                            'mediaId': item.id,
                            'mimeType': item.mimeType,
                            'baseUrl': item.baseUrl
                        })
                    })
                }
                else
                    return []
            }
        ).catch(
            err => console.log('Error in getAlbumPhotos:: ', err)
        );
};

const getPhoto = (baseUrl) => {
    return fetch(baseUrl)
        .then(response => response.blob())
        .catch(err => console.log('Error in getPhoto():: ', err))
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
            result => result.albums.map(album => {
                return ({
                    'album_id': album.id,
                    'album_name': album.title
                })
            })
        ).catch(err => console.log('Error in getAllAlbums::', err))
}

// Get Google photos albums and mediaIds from 
const getPhotosFromGooglePhotosAPI = async () => {
    // 0) Get access token
    const accessToken = await getAccessToken();

    // 1) Get all albums 
    const albums = await getAllAlbums(accessToken);

    // 2) Create array for photos
    let photos = [];

    // 3) Fetch photos from each album
    for (const a of albums) {
        const mediaItems = await getAlbumPhotos(a.album_id, accessToken);
        
        for (const item of mediaItems) {
            const photoBlob = await getPhoto(item.baseUrl);
            item['blob'] = photoBlob;
            item['album_info'] = a;
            item['key'] = item.album_info.album_name + '/' + item.mediaId;
        }

        photos = photos.concat(mediaItems);
    }
    return photos;
};
 
const photos = await getPhotosFromGooglePhotosAPI();
console.log(photos);

// Authenticate to S3
const s3Client = new S3Client(
    {
        region:'us-east-2',
        credentials:{
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        }
    }
);

// upload photos, the key is folder + file name