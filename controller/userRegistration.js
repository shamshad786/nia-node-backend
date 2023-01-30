const UserRegistration = require('../models/userRegister');
const sendEmail = require('../utils/sendemail').sendMail;
const LoginUser = require('../models/login');
const NotificationURL = require('../models/notificationDownload');
const LatestUpdate = require('../models/latestUpdates');


//Notification Download Path URL

exports.notificationURL =  async(req,res)=>{
    try{

        const notificationUrl = await NotificationURL.create(req.body)
        res.status(201).json({
            status: 'Success',
            notification:{
                url: notificationUrl
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'failed',
            message: err
        })
    }
}

exports.notificationUrlPatch = async(req,res)=>{
  try{
    console.log('Notifi Body: ', req.body);

    const notificationPut = await NotificationURL.findByIdAndUpdate(req.params.id, req.body,{
        new: true
    })
    res.status(201).json({
        status: 'Success',
        message: 'URL Update Successfully',
        notification:{
            url: notificationPut
        }
    })
  }catch(err){
    res.status(500).json({
        status: 'failed',
        message: 'Error: Something went Wrong',
        Error: err
    })
  }
}


exports.notificationGetNotifications = async(req,res)=>{
    try{
        const getNotificationUrl = await NotificationURL.find().lean();
        res.status(201).json({
            status: 'Success',
            notification:{
                url: getNotificationUrl
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'failed',
            message: err
        })
    }
}

//Latest Updates & Alert Handler

exports.postLatestUpdates = async(req,res)=>{
    try{

        const latetUpdate = await LatestUpdate.create(req.body);

        res.status(201).json({
            status: 'success',
            latestData:{
                list: latetUpdate
            }
        })


    }catch(err){
        res.status(500).json({
            status: 'failed',
            message: err
        })
    }
}

exports.getLatestUpdates = async (req,res)=>{
    try{

        const latestUpdate = await LatestUpdate.find().sort({"_id" : -1})
        res.status(201).json({
            status: 'success',
            latestData:{
                list: latestUpdate
            }
        })

    }
    catch(err){
        res.status(500).json({
            status: 'failed',
            message: err
        })

    }
}




//__________________________________________________
 
exports.userRegistration = async(req, res)=>{
   
   // var userInfo = req.body;
    const user = new UserRegistration(req.body);
    const isUser = await UserRegistration.findOne({email:req.body.email})
    if(isUser){
        res.json({
            status: 500,
            message: "Email Already Exists",
        });
    }
    else{
       const newUser =  await user.save();
       const allUser = await UserRegistration.find()
       var prevId = allUser[allUser.length-2].registrationnumber
       const updateUser = await UserRegistration.findByIdAndUpdate(
           {
               _id : newUser._id
           },
           {
              $set : { registrationnumber:prevId+1}
           },
           {
               upsert : true
           }
       )
       var userData = await UserRegistration.findById({_id: newUser._id})
      // console.log(userData);
       const {name, email, phone, password} = userData;
       var fileName = "Your Registration Details From BAS\n"+ "Your Registration Number "+ userData.registrationnumber + "\nName :"+ name + "\n " +"Email :"+ email +"\n" +"Phone: "+phone + "\n" + "Password: " + password
    //    console.log(name)
    //    console.log(email)
    //    console.log(phone)
    //    console.log(password)
       sendEmail(['bhartiyaaviation@gmail.com',email],fileName,1);

       res.json({
        status: 201,
        message: "user registered",
        body: updateUser

     }); 
    }
}

exports.allRegisteredUsers =  async(req, res)=>{

    try{
        const allRegisteredUsers =  await UserRegistration.find({}).select({_id: 1});

       if(allRegisteredUsers){

        res.json({
            status: 200,
            message: 'All User fetched',
            response: allRegisteredUsers
        })
       }else{
           res.json({
               status: 404,
               message: 'All users Not foubnd',
           })
       }

    }catch(err){
      console.log('someting went wrong for fethinch users',err)
    }


}

exports.loginUser = async(req,res)=>{
    // userLoginDetails = req.body
    // console.log(userLoginDetails);
    console.log(req.body);
    try{
        
    const userLogin = await UserRegistration.findOne({registrationnumber: req.body.registrationnumber});
    console.log(userLogin);
    if(!userLogin){
        res.json({
            status: 404,
            message: 'User not registered',
        })
    }else{
       
        if(userLogin.password === req.body.password){
            // const userLoginData = new LoginUser({isLoggedin: true, userId: userLogin._id})
            //  await userLoginData.save()
            const {password, ...otherData} =  userLogin._doc;

           
            console.log(otherData);
            res.json({
                status: 200,
                message:'user loggedin',
                body: otherData
            })
        }else{
            res.json({
                status: 404,
                message: "invalid credentials"
            })
        }
    }
    }catch(err){
        res.status(404).json({message: 'something went wrong'})
        console.log("in login error" ,err);
    }
}

exports.loginState = async(req, res)=>{

   try{
    const loginStateData = await LoginUser.find();

    if(loginStateData){
        res.json({
            status: 200,
            message: 'user loggedin',
            response: loginStateData
        })
    }
   }catch(err){
        console.log('user loggedin state',err);
   }
  
}

exports.forgetPasword = async(req,res)=>{
    console.log(req.body);
    try{ 
        const forgetPassword  = await UserRegistration.findOne({email: req.body.email});
        if(forgetPassword){

            const {registrationnumber, name, email, phone, password} = forgetPassword
        //    console.log(registrationnumber,name,email,phone,password)

            let fileName = `Your Registration Details From NIA Aviation Services Pvt Ltd\n\n Registration number: ${registrationnumber} \n Name: ${name} \n E-mail: ${email} \n Phone: ${phone} \n Password: ${password} \n` 
            sendEmail(email, fileName,1);

            res.json({
                status: 200,
                message: "Your Detail Has Been Send You Registered E-mail Id  Go Check Your E-mail Inbox",
            });
        }else{
            res.json({
                status: 404,
                message: 'This E-mail Can Not Be Found Please Enter Registered Email'
            });
        }
    }catch(err){
        console.log("forget password ", err);
    }
}