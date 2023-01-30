const express = require("express")
const formController = require("../controller/formController")
const formRouter = express.Router()


formRouter.post("/formdata",formController.postFormData);
formRouter.get("/formdata",formController.getAllFormData);
formRouter.get('/formdata/:id', formController.getSingleForm);
formRouter.post("/contactform",formController.postContactForm);
formRouter.get('/contactform', formController.getContactFormQueries);
formRouter.get('/userdash/:id', formController.getUserForms);
formRouter.post("/generatepdf", formController.generatePdf);
formRouter.post("/downloadpdf", formController.downloadPdf);

module.exports = formRouter