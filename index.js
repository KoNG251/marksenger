require('dotenv').config()

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT;
const cors = require('cors');

const { readdirSync } = require('fs')
const middlewares = [express.json(), cors()];

middlewares.forEach(middleware => app.use(middleware));
app.use('/picture/post', express.static(path.join(__dirname, 'uploads/posts')))
app.use('/avatar', express.static(path.join(__dirname, 'uploads/avatar')))
app.use('/picture/group', express.static(path.join(__dirname, 'uploads/groups')))

app.get("/", (req, res) => res.json({
    message: "deploy successfully!"
}));

readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)))


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
