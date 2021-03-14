const { Router } = require('express')
const router = Router();
const Drawings = require('../UserDrawings/Drawings');
const allDrawings = require('../UserDrawings/AllDrawings');

const User = require('../models/userModel')
var azure = require('azure-storage');
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=storagechpp;AccountKey=FGXCDfk7l/liMTAlQHoy34Zy6617NknTHulQYsyKPHFbrxPpOrJcLXMUmdYLb1vwggPRNBDpukxJY6C6qKaDDA==;EndpointSuffix=core.windows.net";
const blobServiceClient = azure.createBlobService(AZURE_STORAGE_CONNECTION_STRING);
const VideoModel = require('../models/VideoModel')



router.post('/updateBio', async (req, res) => {
    var bio = req.body.bio;
    var email = req.body.email;
    var font =req.body.font;
    User.updateOne({ email: email }, { $set: { "bio": bio,"font":font }, }, (err, user) => {
        if (err) {
            res.status(404).json('Try again later!')
        } else {
            res.status(200).json('Updated Successfully !')

        }

    });
});




router.post('/updateUserName', async (req, res) => {
    var oldUserName = req.body.oldUserName;
    var newUserName = req.body.newUserName;
    var password = req.body.password;
    var email = req.body.email;

    try {
        User.findOne({ userName: newUserName }, async function (err, user) {
            if (user) {
                res.status(404).json("userName is already Exist");
            } else {

                User.findOne({ email: email }, async function (err, user) {
                    if (user.password == password) {
                        await Drawings.updateMany({ Drawer: oldUserName },
                            { $set: { "Drawer": newUserName } });


                        await allDrawings.updateMany({ Drawer: oldUserName },
                            { $set: { "Drawer": newUserName } })


                        await User.updateOne({ email: email },
                            { $set: { "userName": newUserName } })

                        await VideoModel.updateMany({email:email},{$set: {"userName":newUserName}})    

                        res.status(200).json('Updated Successfully !')



                    } else {
                        res.status(404).json("Password is wrong !");

                    }

                })




            }
        })
    } catch (e) {
        res.status(404).send("Try Again later");
    }

})






router.post('/updatePassword', async (req, res) => {
    var newPw = req.body.newPassword;
    var oldPw = req.body.oldPassword;

    var email = req.body.email;
    try {


        User.findOne({ email: email }, async function (err, user) {
            if (user.password == oldPw) {

                await User.updateOne({ email: email },
                    { $set: { "password": newPw } })

                res.status(200).json('Updated Successfully !')

            } else {
                res.status(404).json('Password is Wrong !')

            }

        })


    } catch (e) {
        res.status(404).json('try Again !')

    }
})






router.post("/imgUrl", async function (req, res) {
    var name = req.body.name;
    var img = req.body.image;

    try {
        var realFile = Buffer.from(img, "base64");
            console.log(realFile.values);
        var uploadOptions = {
            container: 'myphoto',
            blob: name,
            text: realFile
        }

        var data = await User.findOne({ email: req.body.email });
        if (data.imageUrl != "") {
            blobServiceClient.deleteBlobIfExists("myphoto", data.imageUrl, (err, result) => {
            })
        }
        blobServiceClient.createBlockBlobFromText(uploadOptions.container,
            uploadOptions.blob,
            uploadOptions.text,
            {
                contentType: 'image/jpg',
            },async function (err) {
                if (err) {
                    res.status(404).json("Image not updated,Try again later")
                } else {
                    var myquery = { email: req.body.email };
                    var newvalues = { $set: { imageUrl: name } };
                   await User.updateOne(myquery, newvalues, function (err) {
                        if(err){
                            res.status(404).json("IMAGE NOT UPDATED")
                        }
                    });
                   await VideoModel.updateMany(myquery,{$set: {photoUrl:name}})    

                }
            });
            res.status(200).json("IMAGE UPDATED")
    } catch (e) {
        res.status(404).json("IMAGE NOT UPDATED")

    }
});


module.exports = router;
