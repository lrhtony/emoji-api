const express = require('express');
const app = express();
const cors = require('cors');

const bili = require('./modules/bili');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get(/\/bili\/up\/(\d+)(?:\/(.*))*\/(.*)/, bili.bili_up);

app.get(/\/bili\/live\/(\d+)\/(.*)\/(.*)/, bili.bili_live);

// app.listen(3000, () => {
//     console.log('listening at http://localhost:3000/');
// })

module.exports = app;