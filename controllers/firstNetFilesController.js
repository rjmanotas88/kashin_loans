const sendMailer = require('../utils/sendMail');
const jsonFileLength= require('../utils/fileLenghtParameters.json');
const fs = require('fs');
const { parse } = require('json2csv');
var moment = require('moment');  
const delimiter = "";
const header=false;
const quote ="";
const opts = { delimiter, header,quote};

exports.createSetupFile = function (req, res, next) {
    var date = new Date();
    var formattedDate = moment(date).format('YYYYMMDD');
    const logfile_name= "Kashin_BE"+formattedDate+".txt";
    var superSecret = function(spy,model){
        Object.keys(spy).forEach(
            function(key){ 
                spy[key] = spy[key].padEnd(model[key]," "); 
            }
        )
    }
    try {
        //Require Json Object
        var jsonSetupFile =  req.body.clients; 
        jsonSetupFile.forEach(client => {
            client = superSecret(client,jsonFileLength);
        });

        //Transform to fixed object
        //console.log(jsonSetupFile);
        const tsv = parse(jsonSetupFile, opts).replace(/,/g,'');
        fs.writeFileSync(logfile_name, tsv);
        sendMailer.main(logfile_name,"FirstNet Setup File Kashin Loans");
        
        res.status(200).json({
            status: 'success',
            data: "file created "+ logfile_name
        });


    } catch (error) {
        next(error);
    }
};