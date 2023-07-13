const connectToMongo = require('./db');
const cors = require('cors');
const express = require('express');
connectToMongo();
const app = express();
const port = 5000;
const bodyParser = require('body-parser')

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.use('/api/auth', require('./routes/auth'));


app.listen(port, () => console.log(`Api backend listening on port ${port}!`));


module.exports = app;
