const connectToMongo = require('./db');
const cors = require('cors');
const express = require('express');
connectToMongo();
const app = express();
const port = process.env.PORT || 5000; // Change this line
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

// Change this line
const server = app.listen(port, () => console.log(`Api backend listening on port ${port}!`));

// Add these lines
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
