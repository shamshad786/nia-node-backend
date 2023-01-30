const express = require("express")
const router = express.Router();

const paymentController = require('../controller/razorpay');

router.post('/api/payment', paymentController.createPayment);

module.exports=router


