const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(1).required(),
        location: Joi.string().allow('', null).required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().uri().required(),
        }).allow(null,{}).optional(), // Allows `image` to be optional or `null`
    }).required(),
});

module.exports.reviewSchema=Joi.object({
    listing: Joi.string().required(),
    review:Joi.object({
        ratings:Joi.number().required().min(1).max(5),
        comments:Joi.string().required()

    }).required()
})