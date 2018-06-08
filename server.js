const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const app=express();

//DB config
const db = require('./config/key').mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req,res)=> res.send('Good morning Linda!'));

//use routes
app.use('/api/users',users); // send '/api/users' to users.js, then on user.js file don't need to write '/api/users';
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`server running on port ${port}`));