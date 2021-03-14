const express=require('express');
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false,limit:'50mb'}))
app.use(require('./controller/paintingsController'));
app.use(require('./controller/Auth'));
app.use(require('./controller/editInfo'));
app.use(require('./controller/Data'));
app.use(require('./controller/VideoController'));


module.exports=app;