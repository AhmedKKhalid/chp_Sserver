

const { Router } = require('express')
const router = Router();
const User = require('../models/userModel')
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;





router.get('/users', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});
  


router.post('/getMyData', async (req, res) => {
    var email = req.body.email;
    const myInfo = await User.findOne({ email: email });

    res.status(200).json({ myInfo });
});


router.post('/UsersAllData', async (req, res) => {
    var email = req.body.email;
    var myInfo = await User.findOne({ email: email });
    res.status(200).send({ myInfo });


});



router.post('/recoverPw', async (req, res) => {
    var email = req.body.email;
    var host = req.body.host;
    try{

    await User.findOne({ 'email': email }, function (err, result) {
        if (!result) {
            res.status(404).json('Email is not exist !');

        } else {

            const oauth2Client = new OAuth2(
                "1013476903595-1alg97cp6b579mna517ldhe839i1blip.apps.googleusercontent.com",
                "cBKFx7BB6V8z7W6zgjz13QI4",
                "https://developers.google.com/oauthplayground"
            );
        
            oauth2Client.setCredentials({
                refresh_token: "1//04yeeybxaqNVnCgYIARAAGAQSNwF-L9IrsEwS6ArYQ01ZPgw3zAaibM-lo3qZ7xlbThdXR5Kd89lfoUad_PNmJQoutnBRxAcC1Rk"
            });
            const accessToken = oauth2Client.getAccessToken()
        
        
            const smtpTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "khalid.a5251@gmail.com",
                    clientId: "1013476903595-1alg97cp6b579mna517ldhe839i1blip.apps.googleusercontent.com",
                    clientSecret: "cBKFx7BB6V8z7W6zgjz13QI4",
                    refreshToken: "1//04yeeybxaqNVnCgYIARAAGAQSNwF-L9IrsEwS6ArYQ01ZPgw3zAaibM-lo3qZ7xlbThdXR5Kd89lfoUad_PNmJQoutnBRxAcC1Rk",
                    accessToken: accessToken
                }
            });
            
            const mailOptions = {
                from: "khalid.a5251@gmail.com",
                to: email,
                subject: "Password Recovery",
                generateTextFromHTML: true,
                html: "<b>hey thank you for using our service your password is \n <h1> "+result.password+"</h1> </b>"
            };
        
            smtpTransport.sendMail(mailOptions, (error, response) => {
                error ? res.status(404).json('Try again later !')
                    : res.status(200).json('We have sent a password instruction to your email');
                smtpTransport.close();
            });
        }
    });

    }catch(e){
        res.status(404).json('Try again later !') 
    }

});


function gmailSmtp(email,password,res){
    const oauth2Client = new OAuth2(
        "1013476903595-1alg97cp6b579mna517ldhe839i1blip.apps.googleusercontent.com",
        "cBKFx7BB6V8z7W6zgjz13QI4",
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: "1//04yeeybxaqNVnCgYIARAAGAQSNwF-L9IrsEwS6ArYQ01ZPgw3zAaibM-lo3qZ7xlbThdXR5Kd89lfoUad_PNmJQoutnBRxAcC1Rk"
    });
    const accessToken = oauth2Client.getAccessToken()


    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "khalid.a5251@gmail.com",
            clientId: "1013476903595-1alg97cp6b579mna517ldhe839i1blip.apps.googleusercontent.com",
            clientSecret: "cBKFx7BB6V8z7W6zgjz13QI4",
            refreshToken: "1//04yeeybxaqNVnCgYIARAAGAQSNwF-L9IrsEwS6ArYQ01ZPgw3zAaibM-lo3qZ7xlbThdXR5Kd89lfoUad_PNmJQoutnBRxAcC1Rk",
            accessToken: accessToken
        }
    });
    
    const mailOptions = {
        from: "khalid.a5251@gmail.com",
        to: email,
        subject: "Password Recovery",
        generateTextFromHTML: true,
        html: "<b>hey thank you for using our service your password is \n <h1> "+password+"</h1> </b>"
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? res.status(404).json('Try again later !')
            : res.status(200).json('We have sent a password instruction to your email');
        smtpTransport.close();
    });
}


function zohoSmtp(email,password,res){
    var transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'khalid.a5251@zohomail.eu',
            pass: 'invailedKK123@',
        }
    });
    
    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: 'khalid.a5251@zohomail.eu', // sender address (who sends)
        to: email, // list of receivers (who receives)
        subject: 'Password Recovery ', // Subject line
        html: '<b>hey thank you for using our service your password is \n <h1> '+password+'</h1> </b>'
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        error ? res.status(404).json('Try again later !')
            : res.status(200).json('We have sent a password instruction to your email');
    });

}



function outlookSmtp(email,password,res){
    nodeoutlook.sendEmail({
        auth: {
            user: "khalid.a5251@outlook.com",
            pass: "01201697726a"
        },
        from: 'khalid.a5251@outlook.com',
        to: email,
        subject: 'Password Recovery ', // Subject line
        html: '<b>hey thank you for using our service your password is \n <h1> '+password+'</h1> </b>',
        text: 'This is text version!',
       
        onError: (e) => res.status(404).json('Try again later !'),
        onSuccess: (i) => res.status(200).json('We have sent a password instruction to your email')
    }
     
     
    );
}

module.exports = router;

// var transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com", // hostname
//     secureConnection: false, // TLS requires secureConnection to be false
//     port: 587, // port for secure SMTP
//     tls: {
//        ciphers:'SSLv3'
//     },
//     auth: {
//         user: 'khalid.a5251@outlook.com',
//         pass: '01201697726a'
//     }
// });

// // setup e-mail data, even with unicode symbols
// var mailOptions = {
//     from: 'khalid.a5251@outlook.com', // sender address (who sends)
//     to: "20912017100088@fci.zu.edu.eg", // list of receivers (who receives)
//     subject: 'Password Recovery ', // Subject line
//     html: '<b>hey thank you for using our service your password is \n <h1> '+password+'</h1> </b>'
// };

// // send mail with defined transport object
// transporter.sendMail(mailOptions, function(error, info){
//     error ? res.status(404).json('Try again later !')
//         : res.status(200).json('We have sent a password instruction to your email');
// });