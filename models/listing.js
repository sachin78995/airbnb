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
        filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60"
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
