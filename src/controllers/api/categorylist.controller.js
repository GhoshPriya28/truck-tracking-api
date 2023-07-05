require('dotenv').config();
const { Category } = require("../../sql-connections/models");
const { success, error, customResponse } = require("../../helpers/response/api-response.js");

// create category
exports.createCategory = [
    async (req, res) => {
        try {
            const { categoryName, categoryDescription } = req.body;

            // Validate inputs
            if (categoryName === '' || categoryName === undefined || categoryName === null) {
                return error(res, 400, "Please provide a category name.");
            }
            if (categoryDescription === '' || categoryDescription === undefined || categoryDescription === null) {
                return error(res, 400, "Please provide a category description.");
            }

            // Check if the category already exists
            const existingCategory = await Category.findOne({ where: { category_name: categoryName } });
            if (existingCategory) {
                return customResponse(res, 1, "Category name already exists.");
            }

            // Create the category
            const insertCategoryData = {
                category_name: categoryName,
                category_description: categoryDescription
            };
            await Category.create(insertCategoryData);

            success(res, 200, "Successfully added to the category list.");
        } catch (err) {
            customResponse(res, 1, err);
        }
    }
];

exports.getAllListCategory = async (req, res) => {
    try {
        const categories = await Category.findAll();

        // If there are no categories, it will return an empty array
        if (!categories || categories.length === 0) {
            return customResponse(res, 1, "No categories found", []);
        }
        success(res, 200, "List of categories", categories);
    } catch (err) {
        customResponse(res, 1, err);
    }
};
