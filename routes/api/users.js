const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
//const User = mongoose.model('users');
// load User model

//load Input Validation
const validateRegisterInput = require ('../../validation/register');
const validateLoginInput  = require ('../../validation/login');
const User = require('../../models/User') // can use mongoose methods after loading User model




// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

// because we use rounter, we don't need to write './routes/api/users/test'
router.get('/test',(req,res) => res.json({msg: "Users works"})); //res.json will automatically send code 200. res.json is same as res.send but send output json.

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req,res) =>{

  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation
  if (!isValid){
    return res.status(400).json(errors);
  }

  const userEmail = req.body.email // when we send data to a route through a post requests which will utilmately be trhough a form in our react application. We access the data by req.body. Need import bodyParser in server.js
  // findOne() mongoose method
  User.findOne({email:userEmail}) // mongoose can use callback function of promise(.then)
    .then(user => {
      if (user){
        errors.email = 'Email already exists'
        return res.status(400).json(errors.email);
      } else {
        const avatar = gravatar.url(req.body.email,{
          s:'200', // Size
          r: 'pg', //Rating
          d:'mm' //Default, no picutre icon
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar, // same as avatar: avatar
          password:req.body.password
        });

        bcrypt.genSalt(10,(err,salt) => {
          bcrypt.hash(newUser.password,salt,(err,hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
})


/**
* @route   GET api/users/login
* @desc    Login User / Returning JWT Token
* @access  Public
*/


router.post('/login', (req,res) => {
   const { errors, isValid } = validateLoginInput(req.body);
  //check validation
  if (!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({email})
  .then(user => {
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
     //Check Password
    bcrypt.compare(password,user.password)
      .then(isMatch => {
        if(isMatch){
          //User Matched

          const payload ={id:user.id, name: user.name, avatar: user.avatar} // Create jwt payload

          //Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 }, //3600 is an hour
            (err,token) => {
              res.json({
                success: true,
                token: 'Bearer '+ token
              });
          });
        } else {
          errors.password = 'Password incorrect'
          return res.status(400).json(errors);
        }
      })
  })

})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

// router.get('/current', passport.authenticate('jwt', {session: false}), (req,res) => {res.json({msg:'success'})
//   }
//   )
router.get('/current', passport.authenticate('jwt', { session: false}), (req,res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
)

module.exports = router; // export router for server.js to pick it up


