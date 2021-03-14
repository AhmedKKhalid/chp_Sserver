const mongoose=require('mongoose')
var MongoClient = require('mongodb').MongoClient;


mongoose.connect('mongodb+srv://invailedkks:01201697726a@cluster0.uwxih.mongodb.net/ChallengePaintings?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(db=>console.log('Connection Done !'));



