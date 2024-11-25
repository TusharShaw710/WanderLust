const express=require("express");
const app=express();
const Listing=require("./model/listing.js");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const asyncwrap=require("./utils/asyncWrap.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./utils/Schema.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");

app.use(session({
    secret:"Mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}));

app.use(flash());




const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}
const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

app.engine("ejs",ejsMate);

const path=require("path");

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));
app.use(methodOverride('_method'));

const mongoose = require('mongoose');

main().then((res)=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

app.listen(3000,(req,res)=>{
    console.log("Listening...");
});

app.get("/",(req,res)=>{
    res.send("root is working.")
});


app.set("views",path.join(__dirname,"/views"));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);

app.get("/testingList",(req,res)=>{
    let list=new Listing({
        Title:"ITC Sonar Bangla",
        Description:"One of the luxirious hotel in kolkata",
        Price:12000,
        Location:"Kolkata",
        Country:"India"
    });
    list.save().then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    });
    res.send("working");
});

app.post("/add",asyncwrap(async(req,res,next)=>{
    const list= await new Listing(req.body.listing);
    if(!list){
        next(new ExpressError(401,"Invalid Input"));
    }
    await list.save();
    req.flash("success","New listing added");
    res.redirect("/listings");
})
);

//-----Error Handler------
app.all("*",(req,res,next)=>{//sirf err aur next meh dikkat ho jata hai yaha!
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something Went wrong"}=err;
    res.render("listings/error",{err});
});

