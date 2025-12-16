import express from "express"
import { getThoughts, createThought, updateThought, deleteThought, getThoughtById } from "../controllers/thoughtController.js";


const router  =express.Router();

router.route("/").get(getThoughts).post(createThought);
router.route("/:id").put(updateThought).get(getThoughtById).delete(deleteThought);


export default router