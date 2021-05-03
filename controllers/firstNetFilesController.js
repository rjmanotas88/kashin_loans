const sendMailer = require('../utils/sendMail');
const fs = require('fs');
const { parse } = require('json2csv');
var moment = require('moment');  
const delimiter = "\t";
const header=false;
const quote ="";
const opts = { delimiter, header,quote};

exports.createSetupFile = function (req, res, next) {
    var date = new Date();
    var formattedDate = moment(date).format('YYYYMMDD');
    const logfile_name= "Kashin_BE"+formattedDate+".txt";
    try {

        const tsv = parse(req.body.clients, opts);
        fs.writeFileSync(logfile_name, tsv);
        console.log(tsv);
        sendMailer.main(logfile_name,"FirstNet Setup File Kashin Loans");
        
        res.status(200).json({
            status: 'success',
            data: "file created "+ logfile_name
        });


    } catch (error) {
        next(error);
    }
};