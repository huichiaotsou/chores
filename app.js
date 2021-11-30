const express = require("express")
const app = express()
app.listen(8080)

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'))

const multer = require("multer")
const upload = multer()

const utils = require("./utils/save")
const path = require('path');

app.post("/submit", upload.array(), async (req, res, next) => {
    try {
        const { name, dateAjustment, formatDate} = req.body
    
        const {
            washClothes, hangClothes, collectClothes, foldClothes, washDishes,
            mopFloor, trash, washBedSheet, changeBedSheet, tidyUp,
            washDogs, dogShit, dogPee, walkDog, others
        } = req.body
    
        const chores = [ 
            washClothes, hangClothes, collectClothes, foldClothes, washDishes, 
            mopFloor, trash, washBedSheet, changeBedSheet, tidyUp, 
            washDogs, dogShit, dogPee, walkDog
        ]

        if (others.length != 0) {
            chores.push(others)
        }
    
        const today = new Date(formatDate)
        const adjustedDate = new Date(today.setDate(today.getDate() + parseInt(dateAjustment)))
        console.log("adjustedDate: ", adjustedDate);
    
        const nameId = await utils.saveName(name)
        const choreIds = await utils.saveChores(chores)
        await utils.saveRecords(nameId, choreIds, adjustedDate)
    
        console.log("name id: ", nameId);
        console.log("chore id: ", choreIds);
    
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})


app.get("/api/rewards/:name", async (req, res, next)=> {
    try {
        const {name} = req.params
        const today = new Date()
        const formatDate = today.getFullYear()+"-"+ parseInt(today.getMonth()+1) +"-"+ today.getDate()
        const rewards = await utils.calculateRewards(name)
        const todayRecords = await utils.getTodayRecords(name, formatDate)
    
        res.send(
            {
                name, 
                rewards,
                todayRecords,
                date: formatDate
            })
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})

app.get('/rewards/:name', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/rewards/' + 'rewards.html'));
});

app.get('/records/:name', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/records/' + 'records.html'));
});

app.get("/api/records/:name", async (req, res, next)=> {
    const {name} = req.params
    const sortedRecords = await utils.getAllRecordsSorted(name)
    const rewards = await utils.calculateRewards(name)

    res.send(
        {
            sortedRecords,
            rewards
        }
    )

})