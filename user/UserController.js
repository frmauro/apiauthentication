var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let middleware = require('../middleware');
let jwt = require('jsonwebtoken');
let config = require('../config');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

// CREATES A NEW USER
router.post('/', function (req, res) {
    User.create({
            name : req.body.email,
            email : req.body.email,
            password : req.body.password,
            projects: "Finansys"//req.body.projects
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    var teste = 101;

    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});


// GETS A SINGLE USER FROM THE DATABASE BY EMAIL AND PASSWORD
router.post('/autenticate', function (req, res) {
    var password = req.body.password;


    User.find({email: req.body.email}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the users.");

        var userJson = JSON.stringify(user);
        var userObj = JSON.parse(userJson);

        if (userObj[0].password != req.body.password) {
            let dto =  {
                success: false,
                message: 'Incorrect username or password! User not autorization!'
              }
              return res.status(403).send(dto);
        } 

        let token = jwt.sign({username: userObj[0].password},  config.secret,
            {
                 expiresIn: '1h' // expires in 24 hours
            }
          );

          let dto = {
            success: true,
            message: 'Authentication successful!',
            token: token,
            email: req.body.email
          }

        //res.status(200).send(req.body.password);
        res.status(200).send(dto);
    });

});



// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});


module.exports = router;