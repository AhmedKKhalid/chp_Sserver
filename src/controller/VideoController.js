const { Router } = require('express')
const router = Router();
const User = require('../models/userModel')
const VideoModel = require('../models/VideoModel')
var azure = require('azure-storage');
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=storagechpp;AccountKey=FGXCDfk7l/liMTAlQHoy34Zy6617NknTHulQYsyKPHFbrxPpOrJcLXMUmdYLb1vwggPRNBDpukxJY6C6qKaDDA==;EndpointSuffix=core.windows.net";
const blobServiceClient = azure.createBlobService(AZURE_STORAGE_CONNECTION_STRING);



router.post('/addVideo', async (req, res) => {
    console.log('ad');

    const { desc,photoUrl,userName, NumOfVideoLiker, videoLiker, DateTime ,isVideoUploaded,videoUrl,email} = req.body;
    const VideoPost = new VideoModel({ desc,photoUrl,userName, NumOfVideoLiker, videoLiker, DateTime,isVideoUploaded,videoUrl,email });

    var video = req.body.video;

   try {

    VideoModel.findOne({videoUrl:req.body.videoUrl},async function(err,req){

        if (req) {
            res.status(404).json('VIDEO_URL IS ALREADY EXIST');
        } else {

            if (video == '' || video==null) {
                await VideoPost.save();
                console.log('done')
                res.status(200).json('Done');
            } else {
                var realFile = Buffer.from(video, "base64");

                console.log('okssss');

                 var uploadOptions = {
                     container: 'videos',
                     blob: videoUrl,
                     text: realFile
                 }
                 blobServiceClient.createBlockBlobFromText(uploadOptions.container,
                     uploadOptions.blob,
                     uploadOptions.text,
                 {
                        contentType: 'video/mp4',
                     },  async function (error, result, response) {

                        if(error){
                            res.status(404).send("Try again later !");
                            console.log('wrong');
                        }else{

                            await VideoPost.save();
                            console.log(video);

                         res.status(200).json("Done");
            }
                        
                     })
                
            }



            
        }

    })

      
    } catch (e) {
       console.log('err');

        res.status(404);
    }
})




router.get('/getVideos', async (req, res) => {
    const gVideos=await VideoModel.find();
    res.status(200).json(gVideos)

    });
        

    router.post('/addStarsVideo', async (req, res) => {
        var videoUrl=req.body.videoUrl;
        var stars=req.body.stars;
        var yourEmail=req.body.yourEmail;
        console.log(stars)
        try{
        VideoModel.updateOne({"videoUrl":videoUrl},{$inc:{'NumOfVideoLiker':parseInt(stars)} },async function(err){
            if (err) {
                res.status(404).json("Try again later !")
            } else {
             await   User.updateOne({ email: yourEmail }, { $push: { videosThatGotYourStar: videoUrl } })
             await   User.updateOne({ videoUrl: videoUrl }, { $inc: { stars: parseInt(stars) } })
                    
             res.status(200).json("Success")      

            
            }
        }); 
    }catch(e){
        res.status(404).json("Try again later !")

    }   
        });






 


        router.post('/deleteVideo', async (req, res) => {
            var videoUrl = req.body.videoUrl;
            var email = req.body.email;
        
        
            await VideoModel.find({ email: email }, async function (err, obj) {
                if (!obj) {
                     res.status(404).json("Try again later !");
        
                } else {
                    VideoModel.deleteOne({ "videoUrl": videoUrl }, async function (err, obj) {
                        if (err) {
                            return res.send("Try again later !")
                        } else {
                           
                                res.json("Deleted Successfully");
                                console.log("right")
        
        
                        }
                    })
                }
            });
        
        
        });
        
        




module.exports = router;
