const express = require('express')
 const router = express.Router()

 const  userRegisterController = require('../controller/userRegistration');

router.post('/userregistration', userRegisterController.userRegistration );
router.get('/allregisteredusers', userRegisterController.allRegisteredUsers)
router.post('/login', userRegisterController.loginUser );
router.get('/loginstate', userRegisterController.loginState );
router.post('/forget', userRegisterController.forgetPasword);
router.post('/notificationdownload', userRegisterController.notificationURL)
router.get('/notificationdownload', userRegisterController.notificationGetNotifications)
router.patch('/notificationdownload/:id', userRegisterController.notificationUrlPatch)

router.get('/latestupdate',userRegisterController.getLatestUpdates)
router.post('/latestupdate',userRegisterController.postLatestUpdates)

 
module.exports = router;  