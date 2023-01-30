const express = require("express")
const router = express.Router()
const jobController = require("../controller/jobpost")

router.post("/post",jobController.createJobPost)
router.get("/post",jobController.getJobPosts)

module.exports = router