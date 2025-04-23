const express = require("express");
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: Number,
    location: String,
    country: String, // Changed from array to string
    image: {
        filename: {
            type: String,
            default: "lodge.png"
        },
        url: {
            type: String,
            default: "/images/lodge.png"
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
