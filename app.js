require('dotenv').config()

const express = require('express');
const app = express();
const port = process.env.PORT;
const cors = require('cors');

const { readdirSync } = require('fs')
const middlewares = [express.json(), cors()];

middlewares.forEach(middleware => app.use(middleware));

readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)))


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
