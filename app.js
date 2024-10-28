const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const User = require('./models/userModel');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require('passport');

app.set("view engine", "ejs");
app.use(express());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.get("/", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    try{
        let { email, password } =req.body;
        let user = await User.findOne({ email });
        if(!user) return res.send("no user found");
        const result = await bcrypt.compare(password, user.password);
        if(result) {
            let token = jwt.sign({id: user._id, email: user.email }, "dhvsvhdsbc")
            res.cookie("token", token);    
            res.send("loggin succus");
        } else {
            res.send("incorrect details")
        }
    } catch {
        console.log(err);
    }
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    try{
        let { username, email, password } =req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        let user = await User.create({
            username,
            email,
            password: hash
        })
        let token = jwt.sign({id: user._id, email: user.email }, "dhvsvhdsbc")
        res.cookie("token", token);
        res.redirect("/")
    }catch (err) {
        console.log(err)
    }
})

app.listen(2000);