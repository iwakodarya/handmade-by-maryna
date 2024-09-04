const express = require('express');
const cors = require('cors');

const app = express()
app.use(cors());

app.listen(8000, function () {
    console.log('Example app listening on port 8000!')
});

app.get('/helloworld', (req, res) => {
    res.send('Hello World!')
})