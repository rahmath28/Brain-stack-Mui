// getting by model
import Thought from "../models/thoughtModel.js"
import { Op } from "sequelize"; // for to use operators..


// Sequelize Methods
// Create	: create, bulkCreate
// Read : 	findAll, findOne, findByPk, count
// Update :	update, save
// Delete :	destroy
// Smart :	findOrCreate, upsert



export const getThoughts = async (req, res) => {

    try {

        // for filters functionality

        let query = { // intha query object ah than fildAll method ku pass panneerukkom..
            where: {// initially filter illa...
                 // inga filters add aagum
            } 
        }; 

        console.log(req.query) // initially empty object ah irukkum : {} 
        // after question mark ku aprm varathu than query params
        // question marku ku aprm add variable namala add pandrathu ..
        // in key value pair , { search: '"book"' } , search :key , "book" : value.. 
        // multiple queries pass panna can use , & operator.. 

        // ex : http://localhost:5000/api/thoughts/?search="book"&test="testing" , will get as :  { search: '"book"', test: '"testing"' }
        // multiple query params na intha maari kedaikum...


        //1 . first filter : search by ( title and content)
        if (req.query.search) { // url oda request  query params la , "search" nu iruntha than , intha fileter kana 
            // if condition run agum..
            // intha query.search na initially empty ah vachurukka object, athula search ku oru object create pandren..

            // two different fields check na "or" opearator use pannaum, opearators use pannaum na , we have to use "op" : means operator from sequelize.
            // two field check so "or" opearator..

            // *** : Query Params : Always string by default, Quotes are part of the value.
            // postman check : shouldnt use double quotes in the value , ex : 
            // http://localhost:5000/api/thoughts?search=horor : look value without string , should pass like that.

            query.where[Op.or] = [
                // two object check  title nd content.
                { title: { [Op.iLike]: `%${req.query.search}%` } }, // checking title by search
                { content: { [Op.iLike]: `%${req.query.search}%` } } // checking title by search
            ]
        }


        // 2. filter (category) , where dra object condition check panna , 
        // single field check panan direct ah check pannalam.
        if(req.query.category){  // intha if parenthesis la irukkathu , req.query.category : url query la category nu oru key iruntha intha condition will run
            query.where.category= req.query.category 
            // left side (query.where.category) : query object la where condition la category ah pass pannirukkom
            // right side (req.query.category) : query params oda variable value , ex : http://localhost:5000/api/thoughts/?category=Learning
        }


        // 3. filter (isFavourite)
        if(req.query.isFavourite){
            query.where.isFavourite =req.query.isFavourite === "true" // only isFavourite true mattum than venum..
        }

        // 4. filter (tags : (hashtags) )
        if(req.query.tag){
            query.where.tags ={[Op.contains] : [req.query.tag]}
            // left side , findAll method vachu , where condition vachu find pandrom model use panni db la,
            // right side ,  query ku kudukkura value ah pass pandrom , like postman la test pandra appo pass pandra value.
        }


        const thoughts = await Thought.findAll(query);

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
            return res.status(404).json({ // IMPORTANT: Early-aa response (404) send pannrom,so function inga stop aaganum, 
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