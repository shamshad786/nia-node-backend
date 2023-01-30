

const res = require("express/lib/response");
const nodemailer = require("nodemailer");
const root = require("../root");
var transport = nodemailer.createTransport({
//   name: "",
host: "smtp.gmail.com",
port: 465,
secure: true,
auth: {
    user: "niaaviationservices@gmail.com",
    pass: "xgbszvwzwmsvytyq",
},
});
exports.sendMail = async (email,fileName,emailType) => {

  return new Promise ((resolve,reject)=>{

    console.log("in email");

    if(emailType==0){
      
    var  mailOption = {
      from: "info@bhartiyaaviation.in",
      to: email,
      subject: "Candidate Application Form",
      text: 'This is your submitted application form send from N.I.A',
      // html: data,
      attachments: [
        {
          fileName: "/website_as_pdf.pdf",
          path: fileName,
          contentType: "application/pdf",
        },
      ],
    };
  }
  if(emailType==1){
      var mailOption = {
          from: "info@bhartiyaaviation.in",
          to: email,
          subject: "Candidate information",
          text: fileName,
          // html: data,
        };
  }
  
    transport.sendMail(mailOption, (err, info) => {
      console.log("in mail send");

      if(err){
        console.log(err)
        reject(err)
      }
      else{
        console.log(info);
        resolve("true")
      }
     
    });
  
    // console.log('this is pdf file link',fileName)
  })
  
};






//email: niaaviationservices@gmail.com
// gmail app password: xgbszvwzwmsvytyq