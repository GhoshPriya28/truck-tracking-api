const responseHelper = require('../helpers/response/response-code-helper');
const dbHelper = require("../sql-connections/models/index.js");
const queryHelper = require("../helpers/query/queryHelper.js");
const chatHelper = require('../helpers/chat/chatHelper.js');

module.exports = (app) => {
    app.locals.responseHelper = responseHelper
    app.locals.dbHelper = dbHelper
    app.locals.queryHelper = queryHelper
    app.locals.chatHelper = chatHelper
};