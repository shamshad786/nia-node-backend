const JobPost = require("../models/post")
exports.createJobPost = async(req,res)=>{
    console.log(req.body);
    var jobPost = new JobPost(req.body)
    try{
    jobPost.save().then(response=>{
        console.log("Job Post Created Succesfully");
        console.log(response);
        res.json({
            status :200,
            message:"Job Post Created",
            body : response
        })
    }).catch(err=>{
        console.log(err);
        res.json({
            status : 500,
            message :"error in creating job post"
        })

    })
}
catch(err){
    console.log("Error In Creating job post");
    res.json({
        status : 500,
        message :"error in creating job post"
    })
}
}
exports.getJobPosts = async(req,res)=>{
    try{
        var jobResults = await JobPost.find().lean()
        res.json({
            status: 200,
            message : "Jobs Fectched Successfully",
            body : jobResults
        })
    }catch(err){
        console.log("Error in fetching the job posts");
        res.json({
            status:500,
            message:"Error in fetching records"
        })
    }
}