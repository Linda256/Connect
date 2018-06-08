const express = require('express');
const mongoose = require('mongoose');
//const Promise = require('promise');

const app=express();

//DB config
const db = require('./config/key').mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req,res)=> res.send('Hello'));

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`server running on port ${port}`));