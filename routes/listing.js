const express=require("express");
const router=express.Router();
const asyncwrap=require("../utils/asyncWrap.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../utils/Schema.js");
const Review=require("../model/review.js");
const Listing=require("../model/listing.js");

router.get("/",asyncwrap(async(req,res)=>{
    let listing=await Listing.find();
    res.render("listings/index",{listing});
    
})
);
router.get("/new",(req,res)=>{
    res.render("listings/new");
});
router.get("/:id",async(req,res)=>{
    let {id}=req.params;
    const list = await Listing.findById(id).populate("reviews");

    res.render("listings/show.ejs",{list});
    
})


router.get("/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
     res.render("listings/edit",{list});
});
router.put("/:id",asyncwrap(async(req,res)=>{
    let {id}=req.params;
    
    await Listing.findByIdAndUpdate(id,req.body.listing,{ runValidators: true, new: true });
    res.redirect(`/listings/${id}`);
    
})
);
router.get("/:id/delete",asyncwrap(async(req,res)=>{
       let {id}=req.params;
       await Listing.findByIdAndDelete(id);
       res.redirect("/listings");
}));

module.exports=router;