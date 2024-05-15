const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


dotenv.config({ path: './config.env' });

require('./db/conn');



const User = require('./models/userSchema');

app.use(express.json());

// we link the router files to make our route easy
app.use(require('./router/auth'));
const router = require('./router/auth');

const PORT = process.env.PORT;




  app.get('/about', (req, res) => {
      console.log('Hello my About');
      res.send('About Hello world from the server');
});

//  app.get('/contact', (req, res) => {
//      //res.cookies("Test", afzaal);
//      res.send('Contact Hello world from the server');
//  });

 app.get('/signin', (req, res) => {
     res.send('Login Hello world from the server');
 });

 app.get('/register', (req, res) => {
     res.send('Registration Hello world from the server');
 });


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
