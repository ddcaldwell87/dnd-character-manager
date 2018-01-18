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
    journals: [journalSchema]
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
            res.render("character/index", {characters: characters});
        }
    });
});

// NEW - render form to create new character
app.get("/characters/new", function(req, res){
    res.render("character/new");
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

// INDEX - show all inventory items
app.get("/inventory", function(req, res){
    Inventory.find({}, function(err, foundInventory){
        if(err){
            console.log(err);
        } else {
            res.render("inventory/index", {inventory: foundInventory});
        }
    });
});

// NEW - form for new inventory item
app.get("/inventory/new", function(req, res){
    res.render("inventory/new");
});

// CREATE - create logic to save new inventory item to db
app.post("/inventory", function(req, res){
    Inventory.create(req.body.inventory, function(err, newInventory){
        if(err){
            console.log(err);
        } else {
            res.redirect("/inventory");
        }
    });
});

// SHOW - shows specific inventory item page
app.get("/inventory/:id", function(req, res){
    Inventory.findById(req.params.id, function(err, foundInventory){
        if(err){
            console.log(err);
        } else {
            res.render("inventory/show", {inventory: foundInventory});
        }
    });
});

// EDIT - edit form for specific inventory item
app.get("/inventory/:id/edit", function(req, res){
    Inventory.findById(req.params.id, function(err, foundInventory){
        if(err){
            console.log(err);
        } else {
            res.render("inventory/edit", {inventory: foundInventory});
        }
    });
});

// UPDATE - update logic to edit specific inventory item
app.put("/inventory/:id", function(req, res){
    Inventory.findByIdAndUpdate(req.params.id, req.body.inventory, function(err, updatedInventory){
        if(err){
            console.log(err);
        } else {
            res.redirect("/inventory/" + req.params.id);
        }
    });
});

// DELETE - deletes a specific inventory item from db
app.delete("/inventory/:id", function(req, res){
    Inventory.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/inventory");
        }
    });
});

// ==============
// JOURNAL ROUTES
// ==============

// INDEX - shows all journals for a specific character
app.get("/characters/:id/journal", function(req, res){
    // Shows specific characters journals
    // Character.findById(req.params.id, function(err, foundCharacter){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         Journal.find({}, function(err, journals){
    //             if(err){
    //                 console.log(err);
    //             } else {
    //                 res.render("journal/index", {journals: journals, character: foundCharacter});
    //                 console.log(foundCharacter);
    //             }
    //         });
    //     }
    // });
    Character.findById(req.params.id).populate("journals").exec(function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("journal/index", {character: foundCharacter});
            console.log(foundCharacter.journals);
        }
    });
});

// NEW - form page to create new journal entry
app.get("/characters/:id/journal/new", function(req, res){
    Character.findById(req.params.id, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("journal/new", {character: foundCharacter});
        }
    });
});

// CREATE - create logic for new journal
app.post("/characters/:id/journal", function(req, res){
    // TODO: add associations
    Character.findById(req.params.id, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            Journal.create(req.body.journal, function(err, journal){
                if(err){
                    console.log(err);
                } else {
                    foundCharacter.journals.push(journal._id);
                    foundCharacter.save();
                    res.redirect("/characters/" + foundCharacter._id);
                }
            });
        }
    });
});

// SHOW - shows a specific journal
app.get("/characters/:id/journal/:id", function(req, res){
    Character.findById(req.params.id, function(err, foundCharacter){
        console.log(foundCharacter);
        if(err){
            console.log(err);
        } else {
            Journal.findById(req.params.id, function(err, journal){
                if(err){
                    console.log(err);
                } else {
                    res.render("journal/show", {journal: journal, character: foundCharacter});
                    console.log(foundCharacter);
                }
            });
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
app.delete("/characters/:id/journal/:id", function(req, res){
    Character.findById(req.params.id, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            Journal.findByIdAndRemove(req.params.id, function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/characters/:id/journal", {character: foundCharacter});
                }
            });
        }
    });
});

// ============
// START SERVER
// ============
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is now running!");
});