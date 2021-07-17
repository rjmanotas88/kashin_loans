const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
var moment = require('moment');  

async function fillPDF(allotment) {
    
    var date_now = new Date();
    var formattedDate = moment(date_now).format('YYYYMMDD HH:MM');
    const formPdfBytes = fs.readFileSync("resources/biweekly_allotment.pdf")
    var bytes = new Uint8Array(formPdfBytes);
    const pdfDoc = await PDFDocument.load(bytes);
    const form = pdfDoc.getForm();

    //transform the data
    let middle_name_i= allotment.middle_name.charAt(0);
    let full_name= [allotment.last_name, allotment.first_name, middle_name_i].filter(Boolean).join(", ");
    let full_name2= [ allotment.first_name,middle_name_i ,allotment.last_name].filter(Boolean).join(" ");
    let full_address = [ allotment.mailing_address,allotment.city ,allotment.state,allotment.zip_code].filter(Boolean).join("/");
    let allotment_account_number= allotment.ssn.replace(/-/g, "")+'5676';

    allotment.total = "$"+allotment.total;
    allotment.signature= "E-Signed by  "+ full_name2 +" on "+ allotment.date_signature;
    allotment.agent_signature = "E-Signed by  "+ allotment.agent_name +" on "+ allotment.agent_signature_date;

    

    //create vars for each form labael
    const name = form.getTextField('name');
    const birthdate = form.getTextField('birthdate');
    const ssn = form.getTextField('ssn');
    const phone = form.getTextField('phone');
    const mailing_address = form.getTextField('mailing_address');
    const physical_address = form.getTextField('physical_address');
    const id_type = form.getTextField('id_type');
    const issue_by = form.getTextField('issue_by');
    const id_number = form.getTextField('id_number');
    const issue_date = form.getTextField('issue_date');
    const exp_date = form.getTextField('exp_date');
    const agent_signature = form.getTextField('agent_signature');
    const agent_name = form.getTextField('agent_name');
    const loan_number = form.getTextField('loan_number');
    const total = form.getTextField('total');
    const total2 = form.getTextField('total2');
    const account_number = form.getTextField('account_number');
    const signature = form.getTextField('signature');
    const date = form.getTextField('date');
    const email = form.getTextField('email');

    //set the form with data comming from json
    name.setText(full_name);
    birthdate.setText(allotment.birthdate);
    ssn.setText(allotment.ssn);
    phone.setText(allotment.telephone);
    mailing_address.setText(full_address);
    physical_address.setText(full_address);
    issue_by.setText(allotment.issue_by);
    id_type.setText(allotment.id_type);
    id_number.setText(allotment.id_number);
    issue_date.setText(allotment.issue_date);
    exp_date.setText(allotment.exp_date);
    agent_signature.setText(allotment.agent_signature);
    agent_name.setText(allotment.agent_name);
    loan_number.setText(allotment.loan_number);
    total.setText(allotment.total);
    total2.setText(allotment.total);
    account_number.setText(allotment_account_number);
    signature.setText(allotment.signature);
    date.setText(allotment.date_signature);
    email.setText(allotment.email);

    form.flatten();
    const pdfBytes = await pdfDoc.save();
    
    fs.writeFileSync('tmp/'+allotment.loan_number+".pdf", pdfBytes);
}

module.exports = { fillPDF };