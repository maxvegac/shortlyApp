import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as errorhandler from 'strong-error-handler';
import * as morgan from 'morgan';
import {config} from './config';
import {index} from './routes/index';
import * as firebase from 'firebase-admin';
export const app = express();

let firebaseConfig = require('./firebase-config.json');

// setup firebase for auth
firebase.initializeApp({
    credential: firebase.credential.cert(firebaseConfig),
    databaseURL: "https://avante-ac251.firebaseio.com"
});
// setup the config for this shortyApp
app.set('config', config);

// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// middleware for json body parsing
app.use(bodyParser.json({limit: '1mb'}));

// we don't want to give information to make it vulnerable
app.disable('x-powered-by');

// middleware for logging requests
app.use(morgan('dev'));

// enable CORS for all origins
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type,authorization");

    next();
});

app.use('/', index);

app.use(errorhandler({
    debug: process.env.ENV !== 'prod',
    log: true,
}));