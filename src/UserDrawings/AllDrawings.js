const{Schema,model}=require('mongoose');

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


 


module.exports=model('AllDrawings',userSchema)