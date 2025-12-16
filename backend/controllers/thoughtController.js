// getting by model
import Thought from "../models/thoughtModel.js"


// Sequelize Methods
// Create	: create, bulkCreate
// Read : 	findAll, findOne, findByPk, count
// Update :	update, save
// Delete :	destroy
// Smart :	findOrCreate, upsert



export const getThoughts = async (req, res) => {

    try {

        const thoughts = await Thought.findAll();

        res.status(200).json({
            success: true,
            count: thoughts.length,
            data: thoughts // data dra variable la(object) , create ana thought ah  kudukkuren..
        });


    } catch (err) {
        res.status(500).json({
            success: false,
            message: "server error fetch thoughts",
            error: err.message,
        });
    }
};


export const createThought = async (req, res) => {

    try {
        // before create have to check , existing
        const { title, content, category, tags } = req.body;
        //   console.log(title, content) // getting data, // have to create thought by this data

        // simple validation
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Please fill atll the fields.."
            })
        }

        // add pannumpothu existing ah db la irukkanu, check pannanum iruntha add aga kudathu.., always remember
        // findOne():  Database-la irukka records-la irundhu FIRST matching row-a mattum edukkum.
        const existingThought = await Thought.findOne({ where: { title } }) // unique ah irukkatha vachu find pannanum..
        if (existingThought) {
            return res.status(400).json({ // 400 : validation error (Bad request) ku use pannikkalam, (real life example :user mistake)
                success: false,
                message: "Thoughts Title already exist.."
            })
        }

        const thought = await Thought.create({ title, content, category, tags }); // create ana thought ah response ah kudukkanum

        // 201:created
        res.status(201).json({
            success: true,
            message: "Thoughts created successfully",
            data: thought // data dra variable la(object) , create ana thought ah  kudukkuren..
        })

    } catch (err) {
        res.status(500).json({ // 500 → backend crash , Server error
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
}


export const updateThought = async (req, res) => {

    try {
        // need ig for update
        // console.log(req.params) // got id from req.params : { id: '3' } so can destructure that
        const { id } = req.params; // is vachu antha product ah find panni update pannanum..

        // getting updated data from body
        const { title, content, category, tags, isFavourite } = req.body;

        const thought = await Thought.findByPk(id);
        // console.log(thought) // got that by id, next update the new data from body.

        // thought illana 
        if (!thought) {
            return res.status(404).json({
                success: false,
                message: "Thought not found",
            });
        }

        // thought variable holds the data found by id 
        await thought.update({ title, content, category, tags, isFavourite })
        res.status(200).json({
            success: true,
            message: "Thought updated successfully..",
            data: thought
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        })
    }
}

export const getThoughtById = async (req, res) => {

    try {

        const { id } = req.params;

        const thought = await Thought.findByPk(id);

        if (!thought) {
          return  res.status(404).json({ // IMPORTANT: Early-aa response (404) send pannrom,so function inga stop aaganum, 
                //return illa na keela irukka code run aagi, double response error varum.
                success: false,
                message: "Thought not found for the id"
            })
        }
        //Function kulla early-aa res.status().json() send panninaa, function stop panna return mandatory.

        res.status(200).json({
            success: true,
            data: thought
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        })
    }
}

export const deleteThought = async (req, res) => {

    try {
        // id vachu delete pannanum , destructuring id from req.params
        const { id } = req.params;

        const thought = await Thought.findByPk(id); // id vachu get panna thought ah delete pannanum.

        if (!thought) { // antha id la thought illana
            return res.status(404).json({
                success: false,
                message: "Thought not found"
            })
        }

        await thought.destroy(); // deleting that thought.
        res.status(200).json({
            success: true,
            message: "Thought deleted successfully.."
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        })
    }
}