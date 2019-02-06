const express = require('express');

const app = express();
const PORT = 3000;

app.use('/js/', express.static('public/js'));
app.use('/css/', express.static('public/css'));
app.use('/assets/', express.static('public/assets'));

app.use(require('./routes/pages'));


app.listen(PORT, () => console.log('Server running on port', PORT))