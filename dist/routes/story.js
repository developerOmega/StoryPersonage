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
router.get('/stories', auth_token_1.authToken, function (req, res) {
    var query = "\n        SELECT * FROM stories\n    ";
    mysql_1.default.getQuery(query, function (err, stories) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (stories.length === 0) {
            return res.json(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }
        return res.json({
            ok: true,
            stories: stories
        });
    });
});
router.get('/stories/:id', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT * FROM stories WHERE id = " + escapedId + "\n    ";
    mysql_1.default.getQuery(query, function (err, story) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!story) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encotro el registro"
                }
            });
        }
        return res.json({
            ok: true,
            story: story[0]
        });
    });
});
router.post('/stories', auth_token_1.authToken, function (req, res) {
    var body = req.body;
    var post = {
        title: body.title,
        plot: body.plot,
        type: body.type,
        report: body.report,
        user_id: req.user.id
    };
    var query = "\n        INSERT INTO stories SET ?\n    ";
    mysql_1.default.postQuery(query, post, function (err, data) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        var query = "\n            SELECT * FROM stories WHERE id = " + data.insertId + "\n        ";
        mysql_1.default.getQuery(query, function (err, story) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            return res.json({
                ok: true,
                story: story[0]
            });
        });
    });
});
router.put('/stories/:id', [auth_token_1.authToken, auth_elements_1.authStory], function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var body = req.body;
    var query = "\n        UPDATE stories SET ? WHERE id = " + escapedId + "\n    ";
    mysql_1.default.updateQuery(query, body, function (err, data) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        var query = "\n            SELECT * FROM stories WHERE id = " + escapedId + "\n        ";
        mysql_1.default.getQuery(query, function (err, story) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            return res.json({
                ok: true,
                story: story[0]
            });
        });
    });
});
router.delete('/stories/:id', [auth_token_1.authToken, auth_elements_1.authStory], function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        DELETE FROM stories WHERE id = " + escapedId + "\n    ";
    mysql_1.default.deleteQuery(query, function (err) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        return res.json({
            ok: true,
            message: "La historia fue eliminada con exito"
        });
    });
});
router.get('/stories/:id/personages', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT personages.id, personages.name, personages.features, personages.age, personages.height, personages.origin\n        FROM stories INNER JOIN story_personages ON stories.id=story_personages.story_id\n        INNER JOIN personages ON story_personages.personage_id=personages.id\n        WHERE stories.id = " + escapedId + ";\n    ";
    mysql_1.default.getQuery(query, function (err, personages) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (personages.length === 0) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }
        return res.json({
            ok: true,
            personages: personages
        });
    });
});
router.get('/stories/:id/user', auth_token_1.authToken, function (req, res) {
    var id = req.params.id;
    var escapedId = mysql_1.default.instance.connection.escape(id);
    var query = "\n        SELECT * FROM stories WHERE id = " + escapedId + "\n    ";
    mysql_1.default.getQuery(query, function (err, story) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!story[0]) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "No se encontro el registro"
                }
            });
        }
        var query = "\n            SELECT id, name, email, type, status, updated_at, created_at FROM users WHERE id = " + story[0].user_id + "\n        ";
        mysql_1.default.getQuery(query, function (err, user) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            return res.json({
                ok: true,
                user: user[0]
            });
        });
    });
});
var routerStory = router;
exports.default = routerStory;
