const config = require('config');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const helmet = require('helmet');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const Joi = require('joi');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const genres = require('./routes/genres');
const home = require('./routes/home');
const express = require('express');
const app = express();

app.set('view engine', 'pug'); 
app.set('views','./views'); //default template path 

//global object in node
process.env.NODE_ENV // undefined | anything you set

console.log('Applciation Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + process.env.app_password);

if(app.get('env') === 'development'){
  app.use(morgan('tiny')); //http logger
  startupDebugger('Morgan enabled....');
}

//built in 3rd party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true})); //for formUrlEndcoded request
app.use(express.static('public')); //service static files in the provided folder
app.use(helmet());
//app.use(morgan('tiny')); 
app.use('/api/genres', genres);
app.use('/',home);

//custom logger
app.use(logger);
//app.use(authenticator);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));