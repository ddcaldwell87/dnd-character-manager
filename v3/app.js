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
app.get("/characters/:charId", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("character/show", {character: foundCharacter});
        }
    });
});

// EDIT - render form to edit specific character
app.get("/characters/:charId/edit", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("character/edit", {character: foundCharacter});
        }
    });
});

// UPDATE - update logic for edit form
app.put("/characters/:charId", function(req, res){
    Character.findByIdAndUpdate(req.params.charId, req.body.character, function(err, updatedCharacter){
        if(err){
            console.log(err);
        } else {
            res.redirect("/characters/" + req.params.charId);
        }
    });
});

// DELETE - delete a character
app.delete("/characters/:charId", function(req, res){
    Character.findByIdAndRemove(req.params.charId, function(err){
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
app.get("/characters/:charId/inventory", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            console.log(foundCharacter);
            res.render("inventory/index", {character: foundCharacter});
        }
    });
});

// NEW - form for new inventory item
app.get("/characters/:charId/inventory/new", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("inventory/new", {character: foundCharacter});
        }
    });
});

// CREATE - create logic to save new inventory item to db
app.post("/characters/:charId/inventory", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            Inventory.create(req.body.inventory, function(err, inventory){
                if(err){
                    console.log(err);
                } else {
                    foundCharacter.inventory.push(inventory);
                    foundCharacter.save();
                    res.redirect("/characters/" + foundCharacter._id + "/inventory/");
                }
            });
        }
    });
});

// SHOW - shows specific inventory item page
app.get("/characters/:charId/inventory/:id", function(req, res){
    Character.findById(req.params.id, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            Inventory.findById(req.params.id, function(err, inventory){
                if(err){
                    console.log(err);
                } else {
                    res.render("inventory/show", {inventory: inventory, character_id: req.params.charId});
                }
            });
        }
    });
});

// EDIT - edit form for specific inventory item
app.get("/characters/:charId/inventory/:id/edit", function(req, res){
    Inventory.findById(req.params.id, function(err, foundInventory){
        if(err){
            console.log(err);
        } else {
            res.render("inventory/edit", {inventory: foundInventory, character_id: req.params.charId});
        }
    });
});

// UPDATE - update logic to edit specific inventory item
app.put("/characters/:charId/inventory/:id", function(req, res){
    Inventory.findByIdAndUpdate(req.params.id, req.body.inventory, function(err, updatedInventory){
        if(err){
            console.log(err);
        } else {
            res.redirect("/characters/" + req.params.charId + "/inventory/" + req.params.id);
        }
    });
});

// DELETE - deletes a specific inventory item from db
app.delete("/characters/:charId/inventory/:id", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            Inventory.findById(req.params.id, function(err, inventory){
                foundCharacter.inventory.remove(inventory);
                foundCharacter.save();
                res.redirect("/characters/" + req.params.charId + "/inventory");
            });
        }
    });
});

// ==============
// JOURNAL ROUTES
// ==============

// INDEX - shows all journals for a specific character
app.get("/characters/:charId/journal", function(req, res){
    // Shows specific characters journals
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            console.log(foundCharacter);
            res.render("journal/index", {character: foundCharacter});
        }
    });
});

// NEW - form page to create new journal entry
app.get("/characters/:charId/journal/new", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            res.render("journal/new", {character: foundCharacter});
        }
    });
});

// CREATE - create logic for new journal
app.post("/characters/:charId/journal", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            Journal.create(req.body.journal, function(err, journal){
                if(err){
                    console.log(err);
                } else {
                    foundCharacter.journals.push(journal);
                    foundCharacter.save();
                    res.redirect("/characters/" + req.params.charId + "/journal/");
                }
            });
        }
    });
});

// SHOW - shows a specific journal
app.get("/characters/:charId/journal/:id", function(req, res){
    Character.findById(req.params.id, function(err, foundCharacter){
        console.log(foundCharacter);
        if(err){
            console.log(err);
        } else {
            Journal.findById(req.params.id, function(err, journal){
                if(err){
                    console.log(err);
                } else {
                    res.render("journal/show", {journal: journal, character_id: req.params.charId});
                    console.log(foundCharacter);
                }
            });
        }
    });
});

// EDIT - form to edit a specific journal
app.get("/characters/:charId/journal/:id/edit", function(req, res){
    Journal.findById(req.params.id, function(err, foundJournal){
        if(err){
            console.log(err);
        } else {
            res.render("journal/edit", {journal: foundJournal, character_id: req.params.charId});
        }
    });
});

// UPDATE - update logic to edit a specific journal
app.put("/characters/:charId/journal/:id", function(req, res){
    Journal.findByIdAndUpdate(req.params.id, req.body.journal, function(err, updatedJournal){
        if(err){
            console.log(err);
        } else {
            res.redirect("/characters/" + req.params.charId + "/journal/" + req.params.id);
        }
    });
});

// DELETE - deletes a specific journal entry
app.delete("/characters/:charId/journal/:id", function(req, res){
    Character.findById(req.params.charId, function(err, foundCharacter){
        if(err){
            console.log(err);
        } else {
            Journal.findById(req.params.id, function(err, journal){
                console.log(journal);
                journal.remove();
                console.log(journal);
                res.redirect("/characters/" + req.params.charId + "/journal");
            });
        }
    });
});

// app.delete("/characters/:id", function(req, res){
//     Character.findByIdAndRemove(req.params.id, function(err){
//         if(err){
//             console.log(err);
//         } else {
//             res.redirect("/characters");
//         }
//     });
// });

// ============
// START SERVER
// ============
app.listen(3000, function(){
    console.log("Server is now running!");
});