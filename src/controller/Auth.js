const { Router } = require('express')
const router = Router();
const User = require('../models/userModel')

router.post('/signup', async (req, res) => {
    const method=req.body.method;

    try {
        const { userName, email, password, drawingOfTheMonth, numOfDrawings, stars, imageUrl,isDisabled,bio,deletedPaintings,font } = req.body;
        const userInfo = new User({
            userName, email, password, drawingOfTheMonth, numOfDrawings, stars, imageUrl,isDisabled,bio,deletedPaintings,font
        });
            //aa
        User.findOne({ email: req.body.email }, async function (err, email) {
            if (email) {
                res.status(404).json('EMAIL IS ALREADY EXIST');
            } else {
                User.findOne({ userName: req.body.userName }, async function (err, user) {
                    if (user) {
                        res.status(404).json('USER_NAME IS ALREADY EXIST');

                    }else{

                     res.status(200).json('Sign Up Successfull !');
                     await userInfo.save();
            }
                    
        } );

    }})
} catch (e) {
        res.status(500).send('there was a problem in signing up');
    }
});



router.post('/signin', async (req, res) => {
    try {
        const method=req.body.method;
        const user = await User.findOne({ email: req.body.email })
        if (!user) {

            return res.status(404).json('THIS EMAIL IS NOT EXIST');
        }
       // const validPassword = await user.valdiatePassword(req.body.password, user.password);

        if (method=="default"&&req.body.password != user.password) {
            return res.status(401).json("WRONG PASSWORD");

        }
        res.status(200).json({user});
      //  res.status(200).json("DONE")

    } catch (e) {
        res.status(500).send('THERE IS A PROBLEM ,TRY AGAIN LATER');
    }
});







module.exports = router;