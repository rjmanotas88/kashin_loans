const sendMailer = require('../utils/sendMail');
const pdfHandler = require('../utils/pdfHandler');
const PDFMerge = require('pdf-merge');
const jsonFileLength= require('../utils/fileLenghtParameters.json');
const paymentsFileLength= require('../utils/paymentsFile.json');
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
        sendMailer.main(logfile_name,logfile_name,"FirstNet Setup File Example Kashin Loans");
        
        res.status(200).json({
            status: 'success',
            data: "file created "+ logfile_name
        });


    } catch (error) {
        next(error);
    }
};

exports.createBiWeeklyPDFFile = async function (req, res, next) {

    var jsonAllotmensAth = req.body.pdf_allotments;
    var files=[];

    for (const allotment of jsonAllotmensAth) {

        try {
           
            await pdfHandler.fillPDF(allotment).then(
                files.push('tmp/'+allotment.loan_number+".pdf")
            );
            

        } catch (error) {
            next(error);
        }
    };



    console.log(files);
    //Generated filename
    var date = new Date();
    var formattedDate = moment(date).format('YYYYMMDD');
    const pdf_filename = "Kashin_SA2_" + formattedDate + ".pdf";

    //Save as new file
    await PDFMerge(files, {output: pdf_filename})
    .then((buffer) => {});

    

    sendMailer.main(pdf_filename,pdf_filename,  "PDF File Created: " + pdf_filename)
    
    res.status(200).json({
        status: 'success',
        data: "file PDF created "
    });

}

exports.getCustomerPayments = function (req, res, next) {

    var payments=[];

    var fs = require('fs');
    var array = fs.readFileSync('resources/payments.txt').toString().split("\n");
    for(i in array) {
        var payload = array[i];
        let payment={};

        var offset = 1;

        Object.keys(paymentsFileLength).forEach(
            function(key){ 
                payment[key] = payload.substring(paymentsFileLength[key].start-1, paymentsFileLength[key].finish).trim(); 
                offset=offset+paymentsFileLength[key];
            }
        )
        payments.push(payment);
    }

    res.status(200).json(
        {
            status: 'success',
            data: payments
        }
    );
}