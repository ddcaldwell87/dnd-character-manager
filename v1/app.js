// INCLUDE MODULES
var mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
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


app.get("/characters", function(req, res){
    Character.find({}, function(err, characters){
        if(err){
            console.log(err);
        } else {
            res.render("character", {characters: characters});
        }
    });
});

app.post("/characters", function(req, res){
    Character.create(req.body.character, function(err, newCharacter){
        if(err){
            console.log(err);
        } else {
            res.redirect("/characters");
        }
    });
});

app.get("/characters/new", function(req, res){
    res.render("new");
});

app.get("/characters/:id", function(req, res){
    Character.findById(req.params.id, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("show", {character: foundCharacter});
        }
    });
});

// New route for new character
app.get("/:user/:character/new", function(req, res){
    res.send("New character form");
});

// Create route for new character
app.post("/:user/:character", function(req, res){
    res.send("You hit the character post route");
});

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

// Index route for journal entries for specific character
app.get("/:user/:character/journal", function(req, res){
    // Shows specific characters journals
    Journal.find({}, function(err, journals){
        if(err){
            console.log(err);
        } else {
            res.render("journal", {journals: journals});
        }
    });
});

// New route for a journal entry for specific character
app.get("/:user/:character/journal/new", function(req, res){
    res.render("newJournal");
});

// Show route for a specific journal entry for specific character
app.get("/:user/:character/journal/:id", function(req, res){
    res.send("Journal page");
    // res.render("journal", {journal: journal});
    // Shows specific characters journal
});

// Create route for a journal entry for specific character
app.post("/:user/:character/journal", function(req, res){
    // TODO: add associations
    Journal.create(req.body.journal, function(err, journal){
        if(err){
            console.log(err);
        } else {
            user.journals.push(journal);
            journal.save();
            res.redirect("/:user/:character/journal/:id");
        }
    });
});

// START SERVER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is now running!");
});