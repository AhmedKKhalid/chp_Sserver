const{Schema,model}=require('mongoose');

const userSchema=new Schema({

    "NumOfVideoLiker":Number,
    "videoLiker":Array,
    "DateTime":String,
    "videoUrl":String,
    "isVideoUploaded":Boolean,
    "userName":String,
    "photoUrl":String,
    "desc":String,
    "email":String
},{writeConcern:
    {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }

});


 


module.exports=model('Videos',userSchema)