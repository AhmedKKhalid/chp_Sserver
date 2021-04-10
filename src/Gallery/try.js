const{Schema,model}=require('mongoose');

const userSchemas=new Schema({

    "DrawingName":String,
    "Drawer":String,
    "TheDrawing":String,
    "desc":String,
    
});


 


module.exports=model('gallery',userSchemas)