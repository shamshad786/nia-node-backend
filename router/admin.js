const express = require('express');
const adminController = require('../controller/adminController');
const adminRoute = express.Router();



//adminRoute.post('/admin/register', adminController.createAdmin);
adminRoute.post('/admin/login', adminController.adminLogin)
adminRoute.post ('/admin/gallery',adminController.gellery)
adminRoute.get('/admin/gallery',adminController.fetchGalleryImage)
adminRoute.delete ('/admin/gallery/:id',adminController.delGalleryImg)
adminRoute.delete('/admin/gallery', adminController.delAllgalleryimg)

module.exports =  adminRoute; 