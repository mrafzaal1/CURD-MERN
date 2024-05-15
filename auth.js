const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");


require('../db/conn');
const User = require("../models/userSchema");

router.get('/', (req, res) => {
    res.send('Hello world from the server router js');
});

// using promises

//router.post('/register', (req, res) => {
//
//    const { name, email, phone, work, password, cpassword } = req.body;
//
//    if(!name || !email || !phone|| !work || !password || !cpassword) {
//        return res.status(422).json({ error: " Plz filled the field properly" });
//    }
//
//    User.findOne({ email: email })
//        .then((userExist) => {
//            if(userExist) {
//            return res.status(422).json({ error: "Email already Exist" });
//            }

//            const user = new User({name, email, phone, work, password, cpassword});

//            user.save().then(() => {
//                res.status(201).json({ message: "user registered sucessfuly" });
//            }).catch((err) => res.status(500).json({ error: "Failed to register"}));
        
//        }).catch(err => { console.log(err); });

    //console.log(req.body.name);
    //console.log(req.body.email);
    //console.log(req.body);
    //res.json({message: req.body});
    //res.send("registration page");
//});

router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if(!name || !email || !phone|| !work || !password || !cpassword) {
        return res.status(422).json ({ error: " Plz filled the field properly" });
    }
    try {
        
        const userExist = await User.findOne({ email: email });

        if(userExist) {
            return res.status(422).json({ error: "Email already Exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password not matching" });
        } else {
            const user = new User({name, email, phone, work, password, cpassword});
            //yaha pe
            await user.save();

            res.status(201).json({ message: "user registered sucessfuly" });
        }


    } catch (err) {
        console.log(err);
    }
     
});

// login route


router.post('/signin', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({error: "Plz Filled The Data"})
        }

        const userLogin = await User.findOne({ email: email });

        //console.log(userLogin);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken ();
            console.log(token);

            res.cookies("jwtoken", token, {
                expires:new Date(Date.now() + 259200000),
                httpOnly:true
            });
        
        if(!isMatch) {
            res.status(400).json({ err : "Invalid Credentials" });
        } else {
            res.json({ message : "User Signin Sucessfull" });
        }
        } else {
            res.status(400).json({ err : "Invalid Credentials" });
        }

        

    } catch (err) {
        console.log(err);   
    }
});



// about us ka page

router.get('/about', authenticate ,(req, res) => {
    console.log('Hello my About');
    res.send(req.rootUser);
});


//get user data for contact us and home page
router.get('/getdata', authenticate, (req,res) => {
    console.log('Hello my About');
    res.send(req.rootUser);
});

// contact us ka page

router.post('/contact', authenticate, async (req, res) => {
    try {
        
        const {name, email, phone, message} = req.body;

        if(!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({ error: "Plzz filled the contact form"});
        }

        const userContact = await User.findOne({_id: req.userID });

        if (userContact) {
            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(201).json({ message: "User Contact Sucessfully" });

        }

    } catch (error) {
        console.log(error);
    }
});

// logout ka page

router.get('/logout', (req, res) => {
    console.log('Hello my logout page');
    res.clearCookie('jwtoken', { path:'/' });
    res.status(200).send('User Logout');
});


module.exports = router;
