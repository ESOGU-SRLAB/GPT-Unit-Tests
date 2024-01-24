const model = require("../Model/model")
const express = require("express")
async function UserHistory(req,res){
    try {
        const {message} = req.body

        let userId = message.userId

        let UserHistory = await model.getResultsByUserId(userId)

        const responseObject = {
            code : "200",
            UserHistory : UserHistory
        }
        
        res.json(responseObject)
    } catch (error) {
        
        const catchErrorResponse = {
            code : "500"
        }

        res.json(catchErrorResponse)
    }
}

module.exports = {UserHistory}