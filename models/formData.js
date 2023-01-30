const mongoose = require("mongoose");


const FormDataSchema = new mongoose.Schema({

    userId : {
        type:mongoose.Schema.Types.ObjectId,
        required : false
    },

    registrationNumber:{
        type: Number,
        required: false
    },

    candidatename:{
        type: String,
        required: false,
        maxlength:30,
    },

    applicationnumber :{
        type: Number,
        default: 1234

    },
    lastname:{
        type: String,
        required: false,
        maxlength: 30,
    },
    fatherhusbandname:{
        type: String,
        required: false,
    },
    mothername:{
        type: String,
        required: false,
    },
    dateofbirth:{
        type: String,
        required: false,
    },
    gender:{
        type: String,
        required: false,
    },
    categorycast:{
        type: String,
        required: false,
    },
    maritalstatus:{
        type: String,
        required: false,
    },
    postapply:{
        type: String,
        required: false
    },
    price:{
        type:String,
        required: false
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    email:{
        type: String,
        required: false,
    },
    mobile:{
        type: Number,
        required: false,
    },
    educationalqualification:{
        type: String,
        required: false,
    },
    educationdivision:{
        type: String,
        required: false,
    },
    intermediate:{
        type: String,
        required: false,
    },
    intermediatedivision:{
        type: String,
        required: false,
    },
    highschool: {
        type: String,
        required: false,
    },
    highschooldivision: {
        type: String,
        required: false,
    },

    uploadphoto:{
        type: String,
        required: false,
    },
    firebasestudentprofile:{
        type: String,
    },
    uploadsignature:{
        type: String,
        required: false,
    },
    firebasestudentsignature:{
        type: String
    },

    address:{
        present:{
            street:{
                type:String,
                required: false,
            },
            houseno:{
                type: String,
                required:false
            },
            village:{
                type: String,
                required: false,
            },
            city:{
                type: String,
                required: false,
            },
            postoffice:{
                type: String,
                required: false,
            },
            state: {
                type: String,
                required: false,
            },
            district:{
                type: String,
                required: false,
            },
            pincode:{
                type: String,
                required: false,
            }    
        },
        permanent:{
           pr_street:{
                type:String,
                required: false,
            },
            pr_houseno:{
                type: String,
                required:false
            },
            pr_village:{
                type: String,
                required: false,
            },
            pr_city:{
                type: String,
                required: false,
            },
            pr_postoffice:{
                type: String,
                required: false,
            },
            pr_state: {
                type: String,
                required: false,
            },
            pr_district:{
                type: String,
                required: false,
            },
            pr_pincode:{
                type: String,
                required: false,
            }
    }
},
  isPresent : {
      type : Boolean,
      required : false
  },
  isDeclaration : {
   type : Boolean,
   required : false   
  },
  paymentStatus:{
      type: String,
      required: false
  },
  paymentId:{
      type: String,
      required: false
  },
  examCentreState:{
      type: String,
      required: false
  },
  examCentreCity:{
      type: String,
      required: false
  }
 
},

{
    timestamps:true
}
)

const FormDataModel = mongoose.model("formData",FormDataSchema)
module.exports = FormDataModel