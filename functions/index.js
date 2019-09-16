const functions = require('firebase-functions');
const excelToJsonUploadController = require('./controllers/excelToJsonUploadController');

exports.app = functions.https.onRequest(async(req , res) =>{
    await excelToJsonUploadController.excelRowsToJson();
    res.send('DONE');
});

