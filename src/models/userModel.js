const{Schema,model}=require('mongoose');

const userSchema=new Schema({

    "userName":String,
    "email":String,
    "password":String,
    "drawingOfTheMonth":Number,
    "stars":Number,
    "numOfDrawings":Number,
    "imageUrl":String,
    "drawingThatGotYourStar":Array,
    "videosThatGotYourStar":Array,

    "isDisabled":Boolean,
    "bio":String,
    "deletedPaintings":Number,
    "font":String
},{writeConcern:
    {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }

});

userSchema.methods.encryptPassword=async(password)=>{
    const salt=await bcyrpts.genSalt(10);

    return  bcyrpts.hash(password,salt);
 }   ;
 

userSchema.methods.valdiatePassword=function(password){
   return  bcyrpts.compare(password,this.password);
}   ;

module.exports=model('User',userSchema)