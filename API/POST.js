const utils = require("../utils/save")

const submit = async (req, res, next) => {
    try {
        const { name, dateAjustment, formatDate} = req.body
    
        const {
            washClothes, hangClothes, collectClothes, foldClothes, washDishes,
            mopFloor, trash, washBedSheet, changeBedSheet, tidyUp,
            washDogs, dogShit, dogPee, walkDog, other1, other2, other3,
        } = req.body
    
        const chores = [ 
            washClothes, hangClothes, collectClothes, foldClothes, washDishes,
            mopFloor, trash, washBedSheet, changeBedSheet, tidyUp, 
            washDogs, dogShit, dogPee, walkDog
        ]

        if (other1.length != 0) {
            chores.push(other1)
        }

        if (other2.length != 0) {
            chores.push(other2)
        }

        if (other3.length != 0) {
            chores.push(other3)
        }
    
        const today = new Date(formatDate)
        const adjustedDate = new Date(today.setDate(today.getDate() + parseInt(dateAjustment)))
        console.log("adjustedDate: ", adjustedDate);
    
        const nameId = await utils.saveName(name)
        const choreIds = await utils.saveChores(chores)
        await utils.saveRecords(nameId, choreIds, adjustedDate)
        
        console.log("name id: ", nameId);
        console.log("chore id: ", choreIds);
        
        await utils.saveRewards(name, new Date(formatDate))
    
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    submit,
}