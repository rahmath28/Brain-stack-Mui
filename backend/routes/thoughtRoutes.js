import express from "express"
import { getThoughts, createThought, updateThought, deleteThought } from "../controllers/thoughtController.js";


const router  =express.Router();

router.route("/").get(getThoughts).post(createThought);
router.route("/:id").put(updateThought).delete(deleteThought);


export default router