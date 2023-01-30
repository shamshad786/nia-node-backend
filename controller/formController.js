const express = require("express")
const FormData = require("../models/formData")
const JobPost = require("../models/post")
const ContactForm = require('../models/contactform')
const sendMail = require('../utils/sendemail').sendMail;
const root = require("../root")
const createPdf = require('../utils/createPdf')
const ejs = require('ejs')
const path = require("path")
const fs = require('fs');
const PDFDocument = require('pdfkit');




exports.postFormData = async (req,res)=>{
    var formParams = req.body
    var postId = req.body.postId
  //  console.log(postId);
    try{
    if(postId){
      await JobPost.findById(postId).then(async(result)=>{
            var postName = result.name
            var price = result.price       
            console.log("POST DATA",postName,price);
            formParams["price"]=price
            formParams["postapply"]=postName
            // var getRes = await FormData.findOne({email : req.body.email})
            // if(getRes){
            //     await 
            //     console.log(getRes);
            //     res.json({
            //         status:200,
            //         message:"email already present"
            //     })
            // }
            const formData = new FormData(formParams)
            var response = await formData.save()
            console.log("response ID",response._id);
            var allRes = await FormData.find()
            console.log("length",allRes.length);
            var prevId = allRes[allRes.length-2].applicationnumber
            var finalResponse = await FormData.findOneAndUpdate(
                {
                    _id : response._id
                },
                {
                    $set : {applicationnumber:prevId+1}
                },
                {
                    upsert: true,
                }
            )
            console.log("Updated response",finalResponse);
            res.json({ 
                status : 200,
                message : "Form Submitted Successfully",
                body : response
            })
        })
        }
    }catch(err){
        res.json({ 
            status : 500,
            message : "Error in form Submission",
        })
    }
}

exports.getAllFormData = async (req,res)=>{

    try{
    var response = await FormData.find().lean().sort({"_id" : -1})
   // console.log("All records fetched");
    res.json({
        status: 200,
        message:"all records fetched",
        body:response 
    })
    }
    catch(err){
        console.log("Error in getting all form records");
        res.json({
            status:500,
            message:"error in getting all records"
        })
    }
}

exports.postContactForm = async(req,res)=>{
    try{
       // console.log(req.body);
        const contactFormdata = req.body;
        console.log(contactFormdata) 
        const contactForm =  new ContactForm(contactFormdata);
        const contactSavedData = await contactForm.save();
        var contactFormDataById = await  ContactForm.findById({_id: contactSavedData._id })
        //console.log(contactFormDataById)
        const {name, email, phone, message} =  contactFormDataById;
        var contactFormSendData = "Candidate Query Form Data\n" + "Name : "+ name + "\n" + "E-mail :"+ email + "\n" + "Phone : " + phone + "\n" + " message : " + message
       await  sendMail(['bhartiyaaviation@gmail.com'],contactFormSendData,1);
        res.json({
            status: 201,
            message: "Your query submitted successfully !!!",
            body: contactSavedData
        });
    }catch(err){
        console.log(err)
        res.json({
            status: 500,
            message: "error in submitting contact form"
        })
    }
}

exports.getContactFormQueries = async(req,res) =>{
    try{
        const allForms = await ContactForm.find({}).sort({"_id" : -1});
        res.json({
            status: 200,
            message: 'All Records Contact Form Fetched',
            response: allForms
        })
    }catch(err){
        console.log(err);
    }
  
}


exports.getSingleForm = async(req,res)=>{
    const id = req.params.id
  //  console.log(id);
    try{
        const singleForm = await FormData.findOne({_id:id});
        res.json({
            status: 200,
            message: 'success',
            response: singleForm
        });
    }catch(err){
        res.json({
            status: 404,
            message: 'failed'
        });
    }
}


exports.getUserForms = async(req,res)=>{
    const id = req.params.id
 //   console.log(id);
    try{
        const userForms = await FormData.find({userId:id}).sort({"_id" : -1})
        console.log(userForms);
        res.json({
            status: 200,
            message: 'success',
            response: userForms
        });
    }catch(err){
        res.json({
            status: 404,
            message: 'failed'
        });
    }
}

//! PDF Generate 
//TODO: Read Documentation before edit pdf layout https://pdfkit.org/

exports.generatePdf = async(req,res)=>{
    var id = req.body.id
    var email = req.body.email

    // console.log(id)
    // console.log(email)
  
try{
     const singleForm = await FormData.findOne({_id:id});
     //console.log(singleForm);
     if(singleForm){
    const doc = new PDFDocument({size: 'A4'});
    doc.pipe(fs.createWriteStream(singleForm._id+'.pdf'));
        // Fit the image within the dimensions
        doc.lineCap('butt')
        .moveTo(10, 10)
        .lineTo(580, 10) 
        .stroke();
     
      // doc.image('images/logo.png',50, 15, {fit: [100, 100], align: 'left', valign: 'top'})
        doc.moveDown();
        doc.text(`N.I.A Aviation Services Pvt Ltd.
        ( Registered Under Ministery Of Corporate Affairs )
        `, {
            width: 410,
            align: 'center',
            valign: 'top'
        });
        doc.moveDown();
        doc.moveDown();

    doc.lineCap('butt')
   .moveTo(10, 120)
   .lineTo(580, 120)
   .stroke();

  // doc.moveDown();

    doc.text(`Registration No: ${singleForm.registrationNumber}`, {
        width: 410,
        align: 'left'
    })   
    doc.moveDown();
    
    doc.text(`Candidate Name: ${singleForm.candidatename}`, {
        width: 410,
        align: 'left'
      })   
      doc.moveDown();

      doc.text(`Last Name: ${singleForm.lastname}`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`Father/Husband/ Name: ${singleForm.fatherhusbandname}`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`Mother Name: ${singleForm.mothername}`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`Date Of Birth: ${singleForm.dateofbirth}`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`Gender: ${singleForm.gender}`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`Categories (cast): ${singleForm.categorycast}`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`Marital status: ${singleForm.maritalstatus}`, {
        width: 410,
        align: 'left'
      }) 

      doc.moveDown();

      doc.text(`Apply For: ${singleForm.postapply}`, {
        width: 410,
        align: 'left'
      }) 

      doc.lineCap('butt')
      .moveTo(10, 420)
      .lineTo(580, 420)
      .stroke();

      doc.moveDown();
      doc.moveDown();

      doc.text(`E-mail: ${singleForm.email}`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`Education Type: ${singleForm.educationalqualification}`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`Intermediate: ${singleForm.intermediate.slice(0,30)}...`, {
        width: 410,
        align: 'left'
      }) 
      doc.moveDown();

      doc.text(`High School: ${singleForm.highschool.slice(0,30)}...`, {
        width: 410,
        align: 'left'
      }) 

      doc.lineCap('butt')
      .moveTo(10, 545)
      .lineTo(580, 545)
      .stroke();

      doc.text(`Application No: ${singleForm.applicationnumber}`, 410, 140)
      
      doc.image(root + "/"+singleForm.uploadphoto, 430, 180, {fit: [100, 100], align: 'center', valign: 'center'})
   .rect(430, 180, 100, 100).stroke()
   .text('Photo:', 430, 160);

      doc.image(root + "/"+singleForm.uploadsignature, 430, 320, {fit: [100, 50], align: 'center', valign: 'center'})
   .rect(430, 320, 100, 50).stroke()
   .text('Signature:', 430, 300);
       

   doc.text(`Mobile No: ${singleForm.mobile}`, 390, 429)
   doc.text(`Division: ${singleForm.educationdivision}`, 390, 458)
   doc.text(`Division: ${singleForm.intermediatedivision}`, 390, 488)
   doc.text(`Division: ${singleForm.highschooldivision}`, 390, 518)

   // present Address
   doc.text(`Present Address:`,80, 570,{
    underline: true
   })
   doc.text(`Street:  ${singleForm.address.present.street.slice(0,15)}...`,80, 600,{
    // yaha styling daal sakte hai
   })
   doc.text(`houseno:  ${singleForm.address.present.houseno.slice(0,15)}...`,250, 600,{
    // yaha styling daal sakte hai
   })
   doc.text(`village:  ${singleForm.address.present.village.slice(0,10)}...`,410, 600,{
    // yaha styling daal sakte hai
   })
   doc.text(`City:  ${singleForm.address.present.city.slice(0,15)}...`,80, 660,{
    // yaha styling daal sakte hai
   })
   doc.text(`Post Office:  ${singleForm.address.present.postoffice.slice(0,15)}...`,250, 660,{
    // yaha styling daal sakte hai
   })
   doc.text(`State:  ${singleForm.address.present.state.slice(0,15)}...`,410, 660,{
    // yaha styling daal sakte hai
   })
   doc.text(`District:  ${singleForm.address.present.district.slice(0,15)}...`,80, 720,{
    // yaha styling daal sakte hai
   })
   doc.text(`Pincode:  ${singleForm.address.present.pincode}`,250, 720,{
    // yaha styling daal sakte hai
})

//doc.addPage({size: 'A4'});
  
   doc.text(`Same Address:  ${singleForm.isPresent ? "---" : "Same Address" }`,80, 760,{
    underline: true
   })

   doc.text(`Permanent Address:`,80,130,{
    underline: true
   })

   doc.text(`Street:  ${singleForm.address.permanent.pr_street.slice(0,15)}...`,80, 160,{
    // yaha styling daal sakte hai
   })
   doc.text(`houseno:  ${singleForm.address.permanent.pr_houseno.slice(0,15)}...`,250, 160,{
    // yaha styling daal sakte hai
   })
   doc.text(`village:  ${singleForm.address.permanent.pr_village.slice(0,10)}...`,410, 160,{
    // yaha styling daal sakte hai
   })
   doc.text(`City:  ${singleForm.address.permanent.pr_city.slice(0,15)}...`,80, 220,{
    // yaha styling daal sakte hai
   })
   doc.text(`Post Office:  ${singleForm.address.permanent.pr_postoffice.slice(0,15)}...`,250, 220,{
    // yaha styling daal sakte hai
   })
   doc.text(`State:  ${singleForm.address.permanent.pr_state.slice(0,15)}...`,410, 220,{
    // yaha styling daal sakte hai
   })
   doc.text(`District:  ${singleForm.address.permanent.pr_district.slice(0,15)}...`,80, 280,{
    // yaha styling daal sakte hai
   })
   doc.text(`Pincode:  ${singleForm.address.permanent.pr_pincode}`,250, 280,{
    // yaha styling daal sakte hai
})

    const dec = 'I declare that the name, class, date of birth, address and other information given by me in the online application form is correct to the best of my knowledge and belief. Which I declare to be truely correct. If the above information is found incomplete or incorrect, my candidature is liable to be terminated at any time.'

doc.text(`Declaration:`,80,310,{
    underline: true
   })
   
   doc.moveDown();
doc.text(`${singleForm.isDeclaration ? dec : "Declaration Not Selected" }`, {
  width: 410,
  align: 'center'
}
);
   doc.moveDown();
   doc.moveDown();
doc.text(`Exam Centre State: ${singleForm.examCentreState}`, {
  width: 410,
}
);

doc.text(`Exam Centre City: ${singleForm.examCentreCity}`, 290, 431)

doc.text(`Payment Status:`,80,465,{
    underline: true
   })

   doc.moveDown();
   doc.moveDown();
doc.text(`Application Fee: ${singleForm.price}`, {
  width: 410,
}
);
   doc.moveDown();
doc.text(`Payment Id: ${singleForm.paymentId}`, {
  width: 410,
}
);
   doc.moveDown();
doc.text(`Payment Status: ${singleForm.paymentStatus}`, {
  width: 410,
}
);
doc.end();



const path1 = root +"/"+ singleForm._id+".pdf"
console.log("PDF PATH :",path1)


const pdfPath = `${__dirname}`
console.log('pdfDIRName: ',pdfPath)
     
var response = await sendMail([email,"bhartiyaaviation@gmail.com"], root +"/"+ singleForm._id+".pdf",0);
    console.log("email res send pdf: ",response);
    res.status(200).json({message:"Email Sent"});


    console.log('pdf file location from backend', root +"/"+ singleForm._id+".pdf")
// delete pdf file after send to email

    const path = root +"/"+ singleForm._id+".pdf"

    // try{
    //     if(response){
    //         setTimeout(()=>{
    //             fs.unlinkSync(path)
    //             console.log('pdf file has been deleted')
    //         },180000);
    //     }else{
    //         console.log('waiting for pdf delete after send to mail')
    //     }
    // }catch(err){
    //     console.log('Error PDF delete: ', err)
    // }
     }}catch(err){
        console.log(err);
    }
}


exports.downloadPdf = async (req,res) =>{
    var id = req.body.id
    var filename = root+"/"+id+".pdf"
    console.log("in download");
    res.sendFile(filename, (err)=>{
       if(err){
           console.log(err)
       }else{
           console.log(filename);
       }
    });
}