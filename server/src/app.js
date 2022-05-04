const express = require('express');
const { port, portFrontEnd } = require('../config/constants');
const routes = require('../routes/api/v1');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('../middleware/error-middleware');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
  origin: `http://localhost:${portFrontEnd}`,
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '../public/post-images')));
app.use('/resources', express.static(path.join(__dirname, '../src/project-images')));

app.use('/api/v1', routes);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
