const express=require("express");
const app=express();
const users=require("./routes/user.js");
const port=3000;
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");


app.use(session({secret: "mysupersecret",resave:false,saveUninitialized:true}));

app.set("views",path.join(__dirname,"/views"));
app.use(flash());

app.listen(port,(req,res)=>{
    console.log("Listening...");
});

app.use((req,res,next)=>{
    res.locals.message=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.use("/users",users);

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`You have send ${req.session.count} request`);

});

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;//we can use it as a global variable
    if(name === "anonymous"){
        req.flash("error","no users registered");
    }else{
        req.flash("success","new name is added");

    }
    res.redirect("/hello");

});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name: req.session.name});

});
