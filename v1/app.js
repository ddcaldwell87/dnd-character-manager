// INCLUDE MODULES
var mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// CONNECT TO MONGODB
mongoose.connect("mongodb://localhost/dnd-character-manager");

// INVENTORY SCHEMA
var inventorySchema = new mongoose.Schema({
    name: String,
    weight: Number,
    quantity: Number,
    type: String
});

var Inventory = mongoose.model("Inventory", inventorySchema);

// JOURNAL SCHEMA
var journalSchema = new mongoose.Schema({
    title: String,
    content: String
});

var Journal = mongoose.model("Journal", journalSchema);

// CHARACTER SCHEMA
var characterSchema = new mongoose.Schema({
    name: String,
    race: String,
    gender: String,
    profession: String,
    inventory: [inventorySchema],
    journal: [journalSchema]
});

var Character = mongoose.model("Character", characterSchema);

// RESTFUL ROUTES
app.get("/", function(req, res){
    res.send("Root route. Sign in or register page");
    // If signed in, redirect to character select page
});

app.get("/:user", function(req, res){
    res.send("Character select page");
    // Shows a list of users characters
});

app.get("/:user/:character", function(req, res){
    res.send("Character sheet page");
    // Shows specific characters character sheet
});

app.get("/:user/:character/inventory", function(req, res){
    res.send("Inventory page");
    // Shows specific characters inventory
});

app.get("/:user/:character/journal", function(req, res){
    res.send("Journal page");
    // Shows specific characters journal
});

// START SERVER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is now running!");
});