import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Amazon AWS S3
import {
    S3Client,
    ListObjectsCommand,
    PutObjectCommand
} from '@aws-sdk/client-s3';

dotenv.config();

// <--- GOOGLE PHOTOS API FUNCTIONS --->

// Authenticate and get Oath2 access token using refresh token
const getAccessToken = () => {
    return fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: process.env.REFRESH_TOKEN,
            redirect_uri: 'http://localhost:3000/'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((result) => result.access_token)
        .catch((err) => console.log('Error in getAccessToken:: ', err));
};

// Get all mediaIds from a given album
const getAlbumPhotos = (albumId, accessToken) => {
    return fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken
        },
        body: JSON.stringify({ albumId: albumId })
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.mediaItems) {
                return result.mediaItems.map((item) => {
                    return {
                        mediaId: item.id,
                        mimeType: item.mimeType,
                        baseUrl: item.baseUrl,
                        description: item.description
                    };
                });
            } else return [];
        })
        .catch((err) => console.log('Error in getAlbumPhotos:: ', err));
};

// Get photo blob
const getPhoto = (baseUrl) => {
    return fetch(baseUrl)
        .then((response) => response.arrayBuffer())
        .catch((err) => console.log('Error in getPhoto():: ', err));
};

// Get all albums in Google Photos
const getAllAlbums = (accessToken) => {
    return fetch('https://photoslibrary.googleapis.com/v1/albums', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken
        }
    })
        .then((response) => response.json())
        .then((result) =>
            result.albums.map((album) => {
                return {
                    album_id: album.id,
                    album_name: album.title
                };
            })
        )
        .catch((err) => console.log('Error in getAllAlbums::', err));
};

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
            item.blob = photoBlob;
            item.album_info = a;
            item.key = `${item.album_info.album_name}/${
                item.description || 'single'
            }_${item.mediaId}.jpeg`;
        }

        photos = photos.concat(mediaItems);
    }
    return photos;
};

// <-- AWS S3 FUNCTIONS -->

// Authenticate to S3
const createAWSClient = () => {
    return new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        }
    });
};

// Make a list of things already in bucket
const getBucketContents = (myS3Client) => {
    return myS3Client
        .send(
            new ListObjectsCommand({
                Bucket: 'handmade-by-maryna'
            })
        )
        .then((response) => response.Contents.map((item) => item.Key));
};

// Upload photos to AWS
const uploadPhotoToAWS = (myS3Client, key, body) => {
    return myS3Client
        .send(
            new PutObjectCommand({
                Bucket: 'handmade-by-maryna',
                Key: key,
                Body: body,
                ContentType: 'image/jpeg'
            })
        )
        .then(console.log('Succesfully uploaded: ', key))
        .catch((err) => console.log('Error uploading ', key, ':: ', err));
};

// <-- MAIN FUNCTION -->
const updateS3Bucket = async () => {
    const photos = await getPhotosFromGooglePhotosAPI();

    const myS3Client = createAWSClient();
    const s3PhotoKeys = await getBucketContents(myS3Client);

    const photosToUpload = photos.filter((photo) => {
        return !s3PhotoKeys.includes(photo.key);
    });

    const uploadsResult = await Promise.allSettled(
        photosToUpload.map((photo) =>
            uploadPhotoToAWS(myS3Client, photo.key, photo.blob)
        )
    );
    
    const photosToDelete = s3PhotoKeys.filter((key) => {
        return !photos.map((photo) => photo.key).includes(key);
    });
    //TODO: Implement delete process

    console.log(
        `Script run complete!\nUploaded count: ${
            uploadsResult.filter((res) => (res.status = 'fulfilled')).length
        }\nFailed to upload count: ${
            uploadsResult.filter((res) => (res.status = 'rejected')).length
        }\nDeleted count: NA\nFailed to delete count: NA`
    );
};

updateS3Bucket();
