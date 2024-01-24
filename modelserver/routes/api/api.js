const express = require("express")
const generate = require("../../controller/generate")
const execute = require("../../controller/execute")

const router = express.Router()

router.post("/generate",generate.Generate)
router.post("/execute",execute.runCode)



module.exports = router