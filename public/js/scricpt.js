const reviewSchema = new Schema({
    comment: {
        type: String,
        required: [true, "Comment cannot be empty"],
        minlength: [10, "Comment must be at least 10 characters"],
    },
    rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
        required: [true, "Rating is required"]
    },
    createdAt: { // Fix key name to camelCase (optional)
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Review", reviewSchema);

