const getPhotoKeysInFolder = async (prefix) => {
    AWS.config.region = 'us-east-2';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:62f94c93-d03e-4a62-bd05-ecbec4365393'
    });

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {
            Bucket: 'handmade-by-maryna'
        }
    });

    try {
        const data = await s3
            .listObjects({
                Bucket: 'handmade-by-maryna',
                Prefix: prefix
            })
            .promise();

        return data.Contents;
    } catch (err) {
        console.log(`Error fetching ${prefix} photos :: `, err);
    }
};
