const { Router } = require('express')
const router = Router();
const Drawings = require('../UserDrawings/Drawings');
const gallary = require('../Gallery/try');
const User = require('../models/userModel')
const AllDrawings = require('../UserDrawings/AllDrawings');
var azure = require('azure-storage');
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=storagechpp;AccountKey=FGXCDfk7l/liMTAlQHoy34Zy6617NknTHulQYsyKPHFbrxPpOrJcLXMUmdYLb1vwggPRNBDpukxJY6C6qKaDDA==;EndpointSuffix=core.windows.net";
const blobServiceClient = azure.createBlobService(AZURE_STORAGE_CONNECTION_STRING);
var cloudinary = require('cloudinary').v2
var fs = require("fs");






router.get('/gallery', async (req, res) => {
    const famousDrawings = await gallary.find();

    res.json(famousDrawings);
});




router.post('/addDrawings', async (req, res) => {

    try {
        const { DrawingName, Drawer, TheDrawing, desc, stars, potm ,potmCurrentWinner} = req.body;

        const drawings = new Drawings({
            DrawingName, Drawer, TheDrawing, desc, stars, potm,potmCurrentWinner
        });
        const allDrawings = new AllDrawings({
            DrawingName, Drawer, TheDrawing, desc, stars, potm,potmCurrentWinner
        });
        Drawings.findOne({ DrawingName: req.body.DrawingName }, async function (err, drawing) {
            if (drawing) {
                res.status(508).json('PAINTING_NAME IS ALREADY EXIST');
            } else {
                Drawings.findOne({ TheDrawing: req.body.TheDrawing }, async function (err, theDrawing) {
                    if (!theDrawing) {
                        var name = req.body.name;
                        var img = req.body.image;
                        var realFile = Buffer.from(img, "base64");
                                                                                console.log(TheDrawing)

                        var uploadOptions = {
                            container: 'paintings',
                            blob: name,
                            text: realFile
                        }
                        blobServiceClient.createBlockBlobFromText(uploadOptions.container,
                            uploadOptions.blob,
                            uploadOptions.text,
                            {
                                contentType: 'image/jpg',
                            },
                            async function (error, result, response) {
                                if (error) {
                                    res.send("Try again later !");
                                } else {
                                    User.updateOne({ userName: Drawer }, { $inc: { numOfDrawings: 1 } }, async function (r, info) {
                                        await drawings.save();
                                        await allDrawings.save();
                                        res.json("Painting Added Successfuly !");
                                    });
                                }
                            });

                    } else {
                        res.status(408).json('THIS PAINTING IS ALREADY EXIST')
                    }
                }
                );
            }
        }
        );
    } catch (e) {
        res.status(500).send('Try again Later !');
    }
});


router.get('/Drawings', async (req, res) => {
    const drawings = await Drawings.find();
    res.json(drawings);
});

router.get('/allDrawings', async (req, res) => {
    const allDrawings = await AllDrawings.find();
    res.json(allDrawings);
});


router.post("/DrawingStars", async function (req, res) {
    var drawingStars = req.body.stars;
    var drawingName = req.body.DrawingName;
    var email = req.body.email;
    var drawerName = req.body.drawer;
    try {
        Drawings.updateOne({ DrawingName: drawingName }, { $inc: { stars: parseInt(drawingStars) } },
            async function (err) {
                if (err) {
                    res.status(404).json("Try again later !")
                } else {
                    AllDrawings.updateOne({ DrawingName: drawingName }, { $inc: { stars: parseInt(drawingStars) } }, function (err) {
                        User.updateOne({ email: email }, { $push: { drawingThatGotYourStar: drawingName } }, async function (err) {
                            User.updateOne({ userName: drawerName }, { $inc: { stars: parseInt(drawingStars) } }, async function (err) {
                                res.status(200).json("Updated Successfuly !")
                            });

                        });
                    });


                }
            });
    } catch (e) {
        res.status(500).json('Try again later');
    }
});


router.post('/getUserAllPaintings', async (req, res) => {
    var userNm = req.body.userName;
    var allDrawings = await AllDrawings.find({ Drawer: userNm });
    res.json(allDrawings);
});



router.post('/deletePainting', async (req, res) => {
    var paintingName = req.body.paintingName;
    var paintingUrl = req.body.paintingUrl;
    var userNm = req.body.userName;


    await Drawings.findOne({ "DrawingName": paintingName }, async function (err, obj) {
        if (obj.potm) {
            res.status(404).json("This Painting Can't delete !");

        } else {
            Drawings.deleteOne({ "DrawingName": paintingName }, async function (err, obj) {
                if (err) {
                    return res.send("Try again later !")
                } else {
                    blobServiceClient.deleteBlobIfExists("paintings", paintingUrl, async (err) => {
                        await AllDrawings.deleteOne({ "DrawingName": paintingName });
                        await User.updateOne({ "userName": userNm }, { $inc: { "deletedPaintings": 1 } },)
                        res.json("Deleted Successfully");
                    });


                }
            })
        }
    });


});





router.get('/getPOTM', async (req, res) => {
    try{
    AllDrawings.findOne({ "potmCurrentWinner": true }, (err, potm) => {
        if (err ||potm==null) {
            res.status(404).send("?");
        } else {
            res.status(200).json(potm);
        }

    })
}catch(e){
    res.status(404).send("Try again later !")
}
})


// router.post('/ff', async (req, res) => {
//    await gallary.insertMany(data);
//         res.send("pk");    
// })








const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

router.post('/ArtisticStyle', async (req, res) => {
    console.log('wel')
try{
     var realImg=req.body.realImg;
     var style=req.body.style;
     console.log(style)
     var realImgBuffer = Buffer.from(realImg, "base64");
    // var styleImgBuffer=Buffer.from(style, "base64");
    deepai.setApiKey('quickstart-QUdJIGlzIGNvbWluZy4uLi4K');
    console.log('s')

    var resp = await deepai.callStandardApi("fast-style-transfer", {
        content: realImgBuffer,
        style: style,
});

console.log(resp)

res.status(200).json(resp)


}catch(e){
    console.log('ee')


}

})






module.exports = router;
