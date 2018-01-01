var mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/dnd-character-manager");

var inventorySchema = new mongoose.Schema({
    name: String,
    weight: Number,
    quantity: Number,
    type: String
});

var Inventory = mongoose.model("Inventory", inventorySchema);

var journalSchema = new mongoose.Schema({
    title: String,
    content: String
});

var Journal = mongoose.model("Journal", journalSchema);

var characterSchema = new mongoose.Schema({
    name: String,
    race: String,
    gender: String,
    profession: String,
    inventory: [inventorySchema],
    journal: [journalSchema]
});

var Character = mongoose.model("Character", characterSchema);

