/**
 * Calculate pagination values: offset and total pages
 * @param {number} currentPage - Current page number
 * @param {number} limit - Number of items per page
 * @param {number} totalItems - Total number of items
 * @returns {object} - Pagination values: offset and totalPages
 */


const getPagination = (currentPage, limit, totalItems) => {     // Define a function named "getPagination" with three parameters: currentPage, limit, and totalItems

    const offset = (currentPage - 1) * limit;       // Calculate the offset (starting index) based on the current page and limit
    const totalPages = Math.ceil(totalItems / limit);   // Calculate the total number of pages based on the total items and limit
    return { offset, totalPages };      // Return an object containing the offset and totalPages values
};

module.exports = { getPagination };     // Export the getPagination function to make it available to other modules
