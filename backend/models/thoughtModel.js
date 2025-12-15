import sequelize from "../config/db.js";
import { DataTypes, Model } from "sequelize"; // coloumn type define panna.., DataTypes : use panni pannanum.

class Thought extends Model { } // Thought create panna pora model 

Thought.init( // Table create aagum sequelize.sync() call pannina approm
    {
        // thoughts ku data: title , content , category , tags , isFav

        title: {
            type: DataTypes.STRING,
            allowNull: false, // means required : true
            validate: { // sequelize la validate use pannithan , length and null lam check panna mudiyum..
                notNull: { msg: "Please add a title" },
                notEmpty: { msg: "Title cannot be empty" }, // add panna extra safety
                len: [1, 100], // Title cannot be more than 100 characters
            }
        },

        content: {
            type: DataTypes.STRING,
            allowNull: false, // means required : true
            validate: {
                notNull: { msg: "Please add a content" },
                len: [1, 1000], // Content cannot be more than 1000 characters
            }
        },

        category: {
            // category ithula onnuthan select pannanum user so enums ah
            type: DataTypes.ENUM("Idea", "Goal", "Quote", "Learning", "Reminder", "Random"), // enum means enaklku intha values ah mattumthan accept pannum.., 
            // enum la illatha values na throws error 
            allowNull: false, // means required : true
            // defaultValue: "Random" // default ah random ah irukku..
        },

        tags: {
            // hashtags kudurathu insta post maari , array of string ah irukku.,  PostgreSQL la ARRAY support irukku
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [] // default ah empty array
        },

        isFavourite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    },
    {
        sequelize,              // DB connection
        tableName: "thoughts",  // table name
        timestamps: true,       // createdAt, updatedAt
    }
);

export default Thought;
