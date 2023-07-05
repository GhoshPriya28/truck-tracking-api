const { Router } = require('express');
const apiRouter = Router();
const { success, error } = require("../helpers/response/api-response.js");

const adminController = require("../controllers/admin/admin.controller.js")
const userListController = require("../controllers/admin/userlist.controller.js")


apiRouter.get('/', (req, res, next) => {
    logger.info("Checking the API status: Everything is OK");
    success(res, 200, "Welcome to Books REST API by The JavaScript Dojo")
});

// Admin login route (get, post)
apiRouter.get("/login", adminController.loginView)
apiRouter.post("/dashboard", adminController.login)  

// dashboard route
apiRouter.get("/dashboardview", adminController.dashboard)
// User list
apiRouter.get("/userLists", userListController.getUserList)
apiRouter.get("/userdetail/:userId", userListController.userDetail)

// Password Set route
apiRouter.post("/passwordSet", adminController.passwordSet);
apiRouter.get("/passwordSet", adminController.renderPasswordSet);

// Handle unmatched routes
apiRouter.all('*', (req, res, next) =>
    error(res, 404, "Route Un-available")
);

module.exports = apiRouter;