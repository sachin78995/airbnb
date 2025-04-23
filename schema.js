const Joi = require("joi");

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        descrption:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.string().required().min(0),
        image:Joi.object({
            filename: Joi.string().required(),
            url: Joi.string().required()
        }).required(),
    }).required(),
})