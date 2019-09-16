const express = require('express');
const bodyParser = require('body-parser');
const textController = require('../controllers/textContoller');
const router = express();

router.use(bodyParser.json());

router.post('/' , (req , res) =>{

    textController.result(req.body.text).then(Res=>{
        const Response = Object.assign(Res.processedText , Res.remainingChars);
        res.send(Response);
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;