const express = require("express")
const app = express()
app.listen(8080)

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'))

const multer = require("multer")
const upload = multer()

const utils = require("./utils/save")
const Post = require("./API/POST")
const Get = require("./API/GET")

const path = require('path')

// Front End pages
app.get('/rewards/:name', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/rewards/' + 'rewards.html'));
});

app.get('/records/:name', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/records/' + 'records.html'));
});

app.post("/submit", upload.array(), Post.submit)

app.get("/api/rewards/:name", Get.rewards)
app.get("/api/records/:name", Get.records)