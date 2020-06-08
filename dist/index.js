"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./server/server"));
var user_1 = __importDefault(require("./routes/user"));
var personage_1 = __importDefault(require("./routes/personage"));
var story_1 = __importDefault(require("./routes/story"));
var story_personage_1 = __importDefault(require("./routes/story_personage"));
var user_auth_1 = __importDefault(require("./routes/user_auth"));
var mysql_1 = __importDefault(require("./mysql/mysql"));
var bodyParser = require("body-parser");
var config_1 = require("./config/config");
var server = server_1.default.init(config_1.port);
server.app.use(bodyParser.urlencoded({ extended: false }));
server.app.use(bodyParser.json());
server.app.use(user_auth_1.default);
server.app.use(user_1.default);
server.app.use(personage_1.default);
server.app.use(story_1.default);
server.app.use(story_personage_1.default);
mysql_1.default.instance;
server.start(function () {
    console.log("Servidor corrieldo en el puerto " + config_1.port);
});
