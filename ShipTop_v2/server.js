//imports
const express = require('express')
const bodyParser = require('body-parser')

//initializing express
const app = express()
const port = process.env.PORT || 3000;

//middleware handler
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

//handling POST requests
app.post('/', urlEncodedParser,function (req, res) {
    console.log(req.body);
    console.log("hi")
    res.send("post recieved")
})

//listening
app.listen(port, () => console.log("listening to port " + port + " ..."))
