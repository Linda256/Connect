const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const app=express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false})); //basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req,res)=> res.send('Good afternoon Linda!'));

//Passport middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

//use routes
app.use('/api/users',users); // send '/api/users' to users.js, then on user.js file don't need to write '/api/users';
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`server running on port ${port}`));