const fs = require('fs');
const os = require('os');
const admin = require('firebase-admin');
const {google} = require('googleapis');
const creds = require('../client_secret');


admin.initializeApp({
    storageBucket: "badgewell-task.appspot.com"
});

const bucket = admin
    .storage()
    .bucket(JSON.parse(process.env.FIREBASE_CONFIG).projectId + '.appspot.com');

async function excelRowsToJson(){
    const client = new google.auth.JWT(
        creds.client_email ,
        null ,
        creds.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
    );

    client.authorize((err , tokens) =>{
        if(err){
            console.error(err);
            return;
        }else{
            console.log('Connected');
        }
    });

    const googleSheetsApi = google.sheets({version: 'v4' , auth: client});
    const options = {
        spreadsheetId : '1kmW1sIaF5CvA8e2AgpKfM2BLG2sk6lahPc2xXSP_1WE',
        range : 'sheet1'
    };

    let data = await googleSheetsApi.spreadsheets.values.get(options);
    const parsedObject = [];
    for(const r of data.data.values){
        let tempJson = {};
        if(r[0] != 'Key'){
            tempJson['Key'] = r[0];
            tempJson['UK'] = r[1];
            tempJson['DE'] = r[2];
            tempJson['EG'] = r[3];
            parsedObject.push(tempJson);
        }
    }

    const languageDirectory = `${os.tmpdir()}/languages`;

    // create big json from excel rows
    const translationMap = {};
    const rows = parsedObject;
    for (const row of rows) {
        for (const header of Object.keys(row)) {
            const key  = row.Key; //Key
            if(header != 'Key' && row[header]){
                const object = typeof translationMap[header] == 'undefined'?  {}  : translationMap[header];
                object[key] = row[header].replace('â€™', '\'')
                translationMap[header] = object
            }
        }
    }

// create folder if it doesnt exist
    if (!fs.existsSync(languageDirectory)){
        fs.mkdirSync(languageDirectory);
    }
// create files
    for(language of Object.keys(translationMap) ){
        console.log(`writing ${language}`)
        await writeFile(`${languageDirectory}/${language}.json`, JSON.stringify(translationMap[language]))

        console.log(JSON.parse(process.env.FIREBASE_CONFIG).projectId + '.appspot.com')
        try {
            console.log(`uploading /i18n/${language}.json `)
            await bucket.upload(`${languageDirectory}/${language}.json`, {destination: `/i18n/${language}.json`});
            console.log(`uploaded /i18n/${language}.json `);
        }catch (error) {
            console.error(error)
            throw new Error('an error in the upload')
        }
    }
}

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) { reject(err); } else {
                console.log(`file written ${path}`);
                resolve(); }
        });
    });

module.exports = {
    excelRowsToJson : excelRowsToJson
};
