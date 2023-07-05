const express = require('express');
const bodyParser = require('body-parser')
const helmet = require('helmet')
const app = express();
const http = require('http');
var https = require('https');
var fs = require('fs');
const socketio = require('socket.io');
var logger = require('./config/logger');
var morgan = require('morgan');
var morganBody = require('morgan-body');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');

//priya ghosh
const FileUpload = require('express-fileupload');

FileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  safeFileNames: true,
  preserveExtension: true,
  abortOnLimit: true,
  responseOnLimit: 'File size limit has been reached',
})


const server = http.createServer(app);
app.use(cors());

const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { NODE_ENV, PORT } = process.env;
const isProduction = NODE_ENV === 'production';

// app.use(flash({ sessionKeyName: 'flashMessage' }));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(express.static(path.join(process.cwd(), "public")));
app.set('views', path.join(__dirname,'views'));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

morganBody(app, {
  prettify : true,
  includeNewLine : false,
  logAllReqHeader : true,
  logRequestId : true,
  stream: logger.stream
});

//Routes
app.use('/', require('./routes/adminRoutes.js'));
app.use('/api', require('./routes/apiRoutes.js'));

// Error Handler
app.use((err, req, res, next) =>
  res.status(500).json({
    message: 'Internal server error',
    error: isProduction ? null : err,
  }),
);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app
