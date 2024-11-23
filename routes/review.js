const express=require("express");
const router=express.Router({ mergeParams: true });
const asyncwrap=require("../utils/asyncWrap.js");
const Listing=require("../model/listing.js");
const Review=require("../model/review.js");
const {listingSchema,reviewSchema}=require("../utils/Schema.js");

//Post review route
router.post("/",asyncwrap(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    

    let newReview=new Review(req.body.review);

    await newReview.save();
    await listing.reviews.push(newReview);
    let result=await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}));
//Delete review route
router.delete("/:reviewid",asyncwrap(async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewid}});//$pull=delete reviews which matches the reviewid 
    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/listings/${id}`);
}));

module.exports=router;
