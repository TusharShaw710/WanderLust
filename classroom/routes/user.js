const express=require("express");
const cookieParser=require("cookie-parser");
const router=express.Router();
const session=require("express-session");
router.use(session({secret: "mysupersecret",resave:false,saveUninitialized:true}));

router.get("/test",(req,res)=>{
    res.send("Test successful");
});

router.use(cookieParser("secretcode"));

router.get("/getsigned",(req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.send("I have send a signed cookie");
});
router.get("/verified",(req,res)=>{
    console.dir(req.signedCookies);
    res.send("verified!");
});
router.get("/",(req,res)=>{
    res.cookie("greet","namaste");
    res.cookie("color","red");
    console.dir(req.cookies);
    let {name="anonymus"}=req.cookies;
    res.send(`Hi!${name}`);

});


module.exports=router;

