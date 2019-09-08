const express = require('express');
const bodyParser = require('body-parser');
const TextController = require('../Controllers/TextContoller');
const router = express.Router();

router.use(bodyParser.json());

router.route('/')
    .post((req , res) =>{

    TextController.result(req.body.text).then(Res=>{
        const Response = Object.assign(Res.ProcessedText , Res.RemainingChars);
        res.send(Response);
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;