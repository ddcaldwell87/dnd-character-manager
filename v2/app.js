// INCLUDE MODULES
var mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser");
    
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

var newCharacter = new Character({
    name: "Calcus",
    race: "Human",
    gender: "Male",
    profession: "Wizard"
});
// newCharacter.save();

var newJournal = new Journal({
    title: "This Is Another Title",
    content: "blah blah blah blah blah"
});
// newJournal.save();

// RESTFUL ROUTES
app.get("/", function(req, res){
    res.send("Root route. Sign in or register page");
    // If signed in, redirect to character select page
});

// // Index route for users characters or sign in/register page
// app.get("/:user", function(req, res){
//     // res.send("Character select page");
//     res.render("user");
//     // Shows a list of users characters
// });

// ================
// CHARACTER ROUTES
// ================

// INDEX - shows all characters
app.get("/characters", function(req, res){
    Character.find({}, function(err, characters){
        if(err){
            console.log(err);
        } else {
            res.render("character/character", {characters: characters});
        }
    });
});

// CREATE - saves new character to database
app.post("/characters", function(req, res){
    Character.create(req.body.character, function(err, newCharacter){
        if(err){
            console.log(err);
        } else {
            res.redirect("/characters");
        }
    });
});

// NEW - render form to create new character
app.get("/characters/new", function(req, res){
    res.render("character/new");
});

// SHOW - shows a specific character page
app.get("/characters/:id", function(req, res){
    Character.findById(req.params.id, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("character/show", {character: foundCharacter});
        }
    });
});

// EDIT - render form to edit specific character
app.get("/characters/:id/edit", function(req, res){
    Character.findById(req.params.id, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("character/edit", {character: foundCharacter});
        }
    });
});

// UPDATE - update logic for edit form
app.put("/characters/:id", function(req, res){
    Character.findByIdAndUpdate(req.params.id, req.body.character, function(err, updatedCharacter){
        if(err){
            console.log(err);
        } else {
            res.redirect("/characters/" + req.params.id);
        }
    });
});

// DELETE - delete a character
app.delete("/characters/:id", function(req, res){
    Character.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/characters");
        }
    });
});

// ================
// INVENTORY ROUTES
// ================

// Index route for inventory of specific character
app.get("/:user/:character/inventory", function(req, res){
    res.send("Inventory page");
    // Shows specific characters inventory
});

// Show route for inventory item of specific character
app.get("/:user/:character/inventory/:id", function(req, res){
    res.send("Inventory page");
    // Shows specific characters inventory
});

// New route for new inventory item for specific character
app.get("/:user/:character/inventory/new", function(req, res){
    res.send("New inventory item form");
});

// Create route for new inventory item for specific character
app.post("/:user/:character/inventory", function(req, res){
        res.send("You hit the inventory post route");
});

// ==============
// JOURNAL ROUTES
// ==============

// INDEX - shows all journals
app.get("/journal", function(req, res){
    // Shows specific characters journals
    Journal.find({}, function(err, journals){
        if(err){
            console.log(err);
        } else {
            res.render("journal/journal", {journals: journals});
        }
    });
});

// NEW - form page to create new journal entry
app.get("/journal/new", function(req, res){
    res.render("journal/new");
});

// SHOW - shows a specific journal
app.get("/journal/:id", function(req, res){
    Journal.findById(req.params.id, function(err, foundJournal){
        if(err){
            console.log(err);
        } else {
            res.render("journal/show", {journal: foundJournal});
        }
    });
    // res.render("journal", {journal: journal});
    // Shows specific characters journal
});

// CREATE - create logic for new journal
app.post("/journal", function(req, res){
    // TODO: add associations
    Journal.create(req.body.journal, function(err, journal){
        if(err){
            console.log(err);
        } else {
            res.redirect("/journal");
        }
    });
});

// EDIT - form to edit a specific journal
app.get("/journal/:id/edit", function(req, res){
    Journal.findById(req.params.id, function(err, foundJournal){
        if(err){
            console.log(err);
        } else {
            res.render("journal/edit", {journal: foundJournal});
        }
    });
});

// UPDATE - update logic to edit a specific journal
app.put("/journal/:id", function(req, res){
    Journal.findByIdAndUpdate(req.params.id, req.body.journal, function(err, updatedJournal){
        if(err){
            console.log(err);
        } else {
            res.redirect("/journal/" + req.params.id);
        }
    });
});

// DELETE - deletes a specific journal entry
app.delete("/journal/:id", function(req, res){
    Journal.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/journal");
        }
    });
});

// START SERVER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is now running!");
});