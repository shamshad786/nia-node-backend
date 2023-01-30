const express = require("express")
const dotenv = require('dotenv');
dotenv.config();
const app = express()
const path = require("path");
const morgan = require("morgan")
const mongooseConnect = require("./db")
const formRouter = require("./router/form")
const jobRouter = require("./router/jobpost")
const paymentRouter = require('./router/payment')
const adminRoute = require('./router/admin');
const userRegister = require('./router/userregistration');
const multer = require('multer')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const port = process.env.PORT || 5002

mongooseConnect()

app.use(cors());

app.options('*', cors());

app.options('/api/v1/upload', cors());


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})

//fix  status code 304 not modified request 
app.disable('etag');

var root = require('./root');

app.use("/api/v1/images", express.static(path.join(__dirname, "/images")));

const limit =  rateLimit({
    max: 800,
    windowMs: 60 * 60 * 1000,
    message: 'Bad Request...Too many request from thi IP, please try again after an hour! '
})

//!Data Sanitization against NoSQl query injection
app.use(mongoSanitize()); 

//!Data Santitization againt XSS(cross-site-scripting)
app.use(xss());


//! secure headers incoming request
app.use(helmet());



const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'images');
       
    },
    filename: (req,file,cb)=>{
        const date =  Date.now()
        const fileName = date + file.originalname
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req,file,cb)=>{
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
            cb(null, true);
        }else{
            cb(null, false)
            return cb(new Error('Only .png, .jpg, .jpeg are allowed'));
        }
    }
});
 

//app.post('/upload', upload.array('multi-files'), (req,res)=>{
app.post('/api/v1/upload', upload.single('file'), (req,res)=>{
    console.log('photo: ', req.body)
    res.json({
        status: 201,
        message: "Images Uploaded BAS",
        response: req.file.path
    });
    console.log('filePath: ',req.file.path)
});


//! Rate Limiter
app.use('/api',limit);

app.use(express.json())
app.use(morgan("dev"))
app.use('/api/v1',formRouter)
app.use('/api/v1',jobRouter)
app.use('/api/v1',paymentRouter)
app.use('/api/v1',userRegister) 
app.use('/api/v1',adminRoute)



app.use('/', (req,res)=>{
    res.send('Server is running!!');
});

app.use('*', (req,res)=>{
    res.send('This route is not available');
});



// app.use("/",async(req,res)=>{
// res.render("index")
// })

app.listen(port,()=>{
    console.log("server is running", port);
})