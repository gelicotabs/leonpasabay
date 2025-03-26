import categoriesModel from "../../models/categoriesModel.js";

const fetchCategories = async (req, res) => {
    try {
         const categories = await categoriesModel.find({});
         res.status(201).send({ success: true, categories: categories });
    } catch (error) {
        console.log("Fetch Categories Error: " + error);
        res.status(500).send({
            success: false,
            message: "Error in getting Categories",
            error,
        });
    }
};

export default fetchCategories;