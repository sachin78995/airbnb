if(process.env.NODE_ENV!="production"){
  require('dotenv').config();

}





const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const Review = require("./models/review.js");
const Contact = require("./models/contact.js");
const GeneralContact = require("./models/generalContact.js");
const flash = require("connect-flash");
const {storage}=require("./cloudconfig.js");
const MongoStore = require("connect-mongo");




// Fix the middleware path - use a relative path from the current file
const {isloggedIn} = require("./middleware.js");


const dbUrl=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err.message);
  });

async function main() {
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store=MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,


});
store.on("error",()=>{
  console.log("ERROR IN THE MONGO SESSION STORE",err);

});
const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
});

// Make contact count available to all views
app.use(async (req, res, next) => {
  try {
    const contactCount = await GeneralContact.countDocuments();
    res.locals.contactCount = contactCount;
    next();
  } catch (err) {
    console.error(err);
    res.locals.contactCount = 0;
    next();
  }
});

app.get("/", isloggedIn,(req, res) => {
  res.redirect("/listings");
});

// Index route
app.get("/listings", isloggedIn,async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// IMPORTANT: Fixed middleware path issue
app.get("/listings/new", isloggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show route
app.get("/listings/:id", async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    let reviews = await Review.find({ _id: { $in: listing.reviews } });
    res.render("listings/show", { listing, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Authentication routes
app.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

app.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// Create listing
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Edit route
app.get("/listings/:id/edit",isloggedIn, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// Update route
app.put("/listings/:id",isloggedIn, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).send("Listing not found");
  }
  
  // Update the listing with the new data
  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { 
      ...req.body.listing,
      image: {
        filename: req.body.listing.image.filename || listing.image.filename,
        url: req.body.listing.image.url
      }
    },
    { new: true }
  );
  
  res.redirect(`/listings/${id}`);
});

// Delete route
app.delete("/listings/:id", isloggedIn,async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// Review route
app.post("/listings/:id/review", async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).send("Listing not found");

    let newReview = new Review(req.body.review);
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!password) {
      throw new Error("Password is required");
    }

    const newUser = new user({ email, username });
    const registeredUser = await user.register(newUser, password);

    console.log("Registered User:", registeredUser);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

// Login route
app.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
  res.redirect("/listings");
});
//logout
app.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out");
    res.redirect("/listings");
  })

})

// Contact form submission route
app.post("/listings/:id/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const listingId = req.params.id;
    
    const contact = new Contact({
      name,
      email,
      message,
      listingId
    });
    
    await contact.save();
    
    req.flash("success", "Your message has been sent successfully!");
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to send message. Please try again.");
    res.redirect(`/listings/${req.params.id}`);
  }
});

// General contact form submission route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const contact = new GeneralContact({
      name,
      email,
      subject,
      message
    });
    
    await contact.save();
    
    req.flash("success", "Your message has been sent successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to send message. Please try again.");
    res.redirect("/listings");
  }
});

// Error handler
app.use((err, req, res, next) => {
  res.send("something went wrong");
});

app.listen(8080, () => {
  console.log("server is started");
});