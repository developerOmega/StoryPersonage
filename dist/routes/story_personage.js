"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_token_1 = require("../middlewares/auth_token");
var auth_elements_1 = require("../middlewares/auth_elements");
var mysql_1 = __importDefault(require("../mysql/mysql"));
var router = express_1.Router();
router.post('/story-personages', [auth_token_1.authToken, auth_elements_1.authStoryPersonage], function (req, res) {
    var body = req.body;
    var post = {
        story_id: body.story_id,
        personage_id: body.personage_id
    };
    var query = "\n        INSERT INTO story_personages SET ?\n    ";
    mysql_1.default.postQuery(query, post, function (err, data) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        var query = "\n            SELECT * FROM story_personages WHERE story_id = " + post.story_id + " AND personage_id = " + post.personage_id + " \n        ";
        mysql_1.default.getQuery(query, function (err, story_personage) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            return res.json({
                ok: true,
                story_personage: story_personage[0]
            });
        });
    });
});
router.delete('/story-personages', [auth_token_1.authToken, auth_elements_1.authStoryPersonage], function (req, res) {
    var storyId = req.query.story_id;
    var personageId = req.query.personage_id;
    var escapedStoryId = mysql_1.default.instance.connection.escape(storyId);
    var escapedPersonageId = mysql_1.default.instance.connection.escape(personageId);
    var query = "\n        DELETE FROM story_personages  WHERE story_id = " + escapedStoryId + " AND personage_id = " + escapedPersonageId + "\n    ";
    mysql_1.default.deleteQuery(query, function (err) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        return res.json({
            ok: true,
            message: "El story_personages fue elimiando con exito",
        });
    });
});
var routerStoryPersonage = router;
exports.default = routerStoryPersonage;
