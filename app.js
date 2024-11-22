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
// app.get("/listings",asyncwrap(async(req,res)=>{
//     let listing=await Listing.find();
//     res.render("listings/index",{listing});
    
// })
// );
// app.get("/listings/:id",async(req,res)=>{
//     let {id}=req.params;
//     const list = await Listing.findById(id).populate("reviews");

//     res.render("listings/show.ejs",{list});
    
// })
// app.get("/listing/new",(req,res)=>{
//     res.render("listings/new");
// });
app.post("/add",asyncwrap(async(req,res,next)=>{
    const list= await new Listing(req.body.listing);
    if(!list){
        next(new ExpressError(401,"Invalid Input"));
    }
    await list.save();
    res.redirect("/listings");
})
);
// app.get("/listing/:id/edit",async(req,res)=>{
//     let {id}=req.params;
//     let list=await Listing.findById(id);
//      res.render("listings/edit",{list});
// });
// app.put("/listings/:id",asyncwrap(async(req,res)=>{
//     let {id}=req.params;
    
//     await Listing.findByIdAndUpdate(id,req.body.listing,{ runValidators: true, new: true });
//     res.redirect(`/listings/${id}`);
    
// })
// );
// app.get("/listings/:id/delete",asyncwrap(async(req,res)=>{
//        let {id}=req.params;
//        await Listing.findByIdAndDelete(id);
//        res.redirect("/listings");
// }));
// //Post review route
// app.post("/listings/:id/review",asyncwrap(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
    

//     let newReview=new Review(req.body.review);

//     await newReview.save();
//     await listing.reviews.push(newReview);
//     let result=await listing.save();
//     res.redirect(`/listings/${req.params.id}`);
// }));
// //Delete review route
// app.delete("/listings/:id/review/:reviewid",asyncwrap(async(req,res)=>{
//     let {id,reviewid}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewid}});//$pull=delete reviews which matches the reviewid 
//     await Review.findByIdAndDelete(reviewid);

//     res.redirect(`/listings/${id}`);
// }));
//-----Error Handler------
app.all("*",(req,res,next)=>{//sirf err aur next meh dikkat ho jata hai yaha!
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something Went wrong"}=err;
    res.render("listings/error",{err});
});

