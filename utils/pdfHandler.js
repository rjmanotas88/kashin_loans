const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
var moment = require('moment');  

async function fillPDF(allotment) {
    var date_now = new Date();
    var formattedDate = moment(date_now).format('YYYYMMDD HH:MM');
    const formPdfBytes = await fs.readFileSync("resources/biweekly_allotment.pdf")
    var bytes = new Uint8Array(formPdfBytes);
    const pdfDoc = await PDFDocument.load(bytes);
    const form = pdfDoc.getForm();

    //transform the data

    allotment.total = "$"+allotment.total;
    allotment.signature= "E-Sing by  "+ allotment.name +" on "+ allotment.date_signature;

    //create vars for each form labael
    const name = form.getTextField('name');
    const birthdate = form.getTextField('birthdate');
    const ssn = form.getTextField('ssn');
    const phone = form.getTextField('phone');
    const email = form.getTextField('email');
    const address = form.getTextField('address');
    const id_type = form.getTextField('id_type');
    const issue_by = form.getTextField('issue_by');
    const id_number = form.getTextField('id_number');
    const issue_date = form.getTextField('issue_date');
    const exp_date = form.getTextField('exp_date');
    const agent_name = form.getTextField('agent_name');
    const loan_number = form.getTextField('loan_number');
    const total = form.getTextField('total');
    const account_number = form.getTextField('account_number');
    const signature = form.getTextField('signature');
    const date = form.getTextField('date');
    const email_2 = form.getTextField('email_2');

    //set the form with data comming from json
    name.setText(allotment.name);
    birthdate.setText(allotment.birthdate);
    ssn.setText(allotment.ssn);
    phone.setText(allotment.telephone);
    email.setText(allotment.email);
    address.setText(allotment.address);
    issue_by.setText(allotment.issue_by);
    id_type.setText(allotment.id_type);
    id_number.setText(allotment.id_number);
    issue_date.setText(allotment.issue_date);
    exp_date.setText(allotment.exp_date);
    agent_name.setText(allotment.agent_name);
    loan_number.setText(allotment.loan_number);
    total.setText(allotment.total);
    account_number.setText(allotment.account_number);
    signature.setText(allotment.signature);
    date.setText(allotment.date_signature);
    email_2.setText(allotment.email);

    form.flatten();
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('tmp/'+allotment.loan_number+".pdf", pdfBytes);
}

module.exports = { fillPDF };