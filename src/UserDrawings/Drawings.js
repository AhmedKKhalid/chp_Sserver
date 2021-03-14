const{Schema,model}=require('mongoose');
const bcyrpts=require('bcryptjs');

const userSchema=new Schema({

    "DrawingName":String,
    "Drawer":String,
    "TheDrawing":String,
    "desc":String,
    "stars":Number,
    "potm":Boolean,
    "potmCurrentWinner":Boolean

},{writeConcern:
    {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }

});


 


module.exports=model('Drawings',userSchema)