const AdminDB = require('../models/admin');
const Gallery = require('../models/galleryImages');


//  exports.createAdmin = async(req,res)=>{

//     let adminData = req.body
//     console.log(adminData)
//     try{
//         const adminObj = new AdminDB(adminData);
//         const admin = await adminObj.save();
//         if(admin){
//             res.json({
//                 status: 201,
//                 mesage: 'Admin Registered',
//                 response: admin
//             });
//         }else{
//             res.json({
//                 status: 404,
//                 message: 'Admin Not Found'
//             });
//         }


//     }catch(err){
//         res.json({
//             status: 500,
//             mesage: 'Internal Server Error'
//         })
//     }

//  }


 exports.adminLogin = async(req,res)=>{

    const loginDetails = req.body;
   // console.log(loginDetails)

    try{
        const adminLoggedin = await AdminDB.findOne({email: loginDetails.email});       
        if(adminLoggedin && adminLoggedin.secretkey == loginDetails.secretkey &&  adminLoggedin.password == loginDetails.password ){

            res.json({
                status: 200,
                message:'Admin Logged In',
                response: adminLoggedin
            });
        }else{
            res.json({
                status: 404,
                message: 'Invalid Credentials'
            });
        }

    }catch(err){
        res.json({
            status: 500,
            message: 'Internal Server Error'
        });
    }

 }


 exports.gellery =  async(req,res)=>{
     try{
        const galleryImagePath =  req.body
        const galleryURL = await Gallery.create(galleryImagePath);
        res.status(201).json({
            status: 'Image Uploaded Successfully',
            imageResponse: galleryURL
        })
    }catch(err){
        res.status(500).json({
            status: 'failed',
            message: 'Someting Went Wrong'
        });
    }

 }


 exports.fetchGalleryImage =  async(req,res)=>{
    try{
        const fetchGalleryImg =  await Gallery.find().sort({"_id" : -1});
        res.status(200).json({
            status: 'success',
            imageResponse: fetchGalleryImg
        })
    }catch(err){
        res.status(500).json({
            status: 'failed',
            message: 'Someting Went Wrong'
        });
    }
 }

 exports.delGalleryImg = async(req,res)=>{

    try{
        const delImgId = req.params.id
        console.log(delImgId)
        await Gallery.deleteOne({_id: delImgId },{
            new: true
        })
        res.status(200).json({
            status: 'success',
        })

    }catch(err){
        res.status(500).json({
            status: 'failed',
            message: 'Someting Went Wrong'
        });
    }
 }

 exports.delAllgalleryimg = async(req,res)=>{
    try{
        await Gallery.deleteMany({});
        res.status(200).json({
            status: 'success deleted all',
        });
    }catch(err){
        res.status(500).json({
            status: 'failed',
            message: 'Someting Went Wrong'
        });
    }
 }