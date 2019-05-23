/*
/// mrDreaml production ------------------
///  ^  ^  ^  ^  ^  ^
/// Andreev D.A.
/// server side, express + socket
*/


const express = require('express');
const fallback = require('express-history-api-fallback');
const bodyParser = require('body-parser');

const app = express();
require('express-ws')(app);
const login = require('./login/login');
const session = require('./session/session');

const connectedUser = [];
connectedUser.maxSessionUser = 5;

login(app, connectedUser);
session(app, connectedUser);

const port = 9000;
const root = 'dist';
app.use(express.static(root));
app.use(bodyParser());
app.use(fallback('index.html', { root }));
app.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${process.env.PORT || port}!`);
});
