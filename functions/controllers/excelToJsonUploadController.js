const XLSX = require("xlsx");
const fs = require('fs');
const admin = require('firebase-admin');

admin.initializeApp({
    storageBucket: "badgewell-task.appspot.com"
});

const bucket = admin
    .storage()
    .bucket(JSON.parse(process.env.FIREBASE_CONFIG).projectId + '.appspot.com');

//const languageDirectory = 'languages';
//const excelFilePath = './excel.xlsx';

//create array of jsons from excel file
function convertExcelToJson(path) {
    const workbook = XLSX.readFile(path);
    const sheet_name_list = workbook.SheetNames;
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return rows;
}

async function excelRowsToJson(){

    const languageDirectory = 'languages';
    const excelFilePath = './excel.xlsx';

// create big json from excel rows
    const translationMap = {};
    const rows = convertExcelToJson(excelFilePath);
    for (const row of rows) {

        for (const header of Object.keys(row)) {
            const key  = row.Key;
            if(header != 'Key'){
                const object = typeof translationMap[header] == 'undefined'?  {}  : translationMap[header]
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
            await bucket.upload(`${languageDirectory}/${language}.json`, {destination: 'file'});
            console.log(`uploaded /i18n/${language}.json `);
        }catch (error) {
            console.error(error)
            throw new Error('an error in the upload')
        }
        // fs.writeFile(`${languageDirectory}/${language}.json`, JSON.stringify(translationMap[language]), 'utf8', (err) => {
        //     console.log(`${languageDirectory}/${language}.json`);
        //
        //     // bucket.upload(`${languageDirectory}/${language}.json`, {
        //     //     destination: `/i18n/${language}.json`
        //     // }).then(file =>{
        //     //     console.log(file);
        //     // }).catch(err =>{
        //     //     console.log(new Error(err));
        //     // });
        //
        //     if (err) throw err;
        //     console.log(`language is complete`);
        // })
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