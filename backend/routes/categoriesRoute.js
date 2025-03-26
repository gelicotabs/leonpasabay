import express from "express";
import fetchCategories from "../controllers/categories/fetchCategories.js";


//router object
const router = express.Router();




router.get("/categories", fetchCategories);



export default router;
