var express = require('express');
var bodyParser = require('body-parser');
const cors = require('./cors');

var Saves = require('../models/save');
var authenticate = require('../authenticate');

var saveRouter = express.Router();
saveRouter.use(bodyParser.json());

saveRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Saves.findOne({ user: req.user._id })
            .populate('user')
            .populate('posts')
            .exec((err, saves) => {
                if (err) return next(err);
                res.setHeader('Content-Type', 'application/json');
                res.json(saves);
            });
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Saves.findOne({ user: req.user._id }, (err, save) => {
            if (err) throw next(err);

            if (!save) {
                Saves.create({ user: req.user._id })
                    .then((save) => {
                        for (i = 0; i < req.body.length; i++)
                            if (save.posts.indexOf(req.body[i]._id) >= 0) //check later
                                save.posts.push(req.body[i]);
                        save.save()
                            .then((save) => {
                                Saves.findById(save._id)
                                    .populate('user')
                                    .populate('posts')
                                    .then((save) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(save);
                                    })
                            })
                            .catch((err) => {
                                return next(err);
                            });
                    })
                    .catch((err) => {
                        return next(err);
                    })
            }
            else {
                for (i = 0; i < req.body.length; i++)
                    if (save.posts.indexOf(req.body[i]._id) < 0)
                        save.posts.push(req.body[i]);
                save.save()
                    .then((save) => {
                        Saves.findById(save._id)
                            .populate('user')
                            .populate('posts')
                            .then((save) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(save);
                            })
                    })
                    .catch((err) => {
                        return next(err);
                    });
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT operation not supported on /posts');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, function (req, res, next) {
        Saves.findOneAndRemove({ user: req.user._id }, (err, resp) => {
            if (err) throw err;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json(resp);
        })
    });

saveRouter.route('/:postId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Saves.findOne({ user: req.user._id })
            .then((saves) => {
                if (!saves) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ "exists": false, "saves": saves });
                }
                else {
                    if (saves.posts.indexOf(req.params.postId) < 0) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": false, "saves": saves });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": true, "saves": saves });
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Saves.findOne({ user: req.user._id }, (err, save) => {
            if (err) return next(err);

            if (!save) {
                Saves.create({ user: req.user._id })
                    .then((save) => {
                        save.posts.push({ "_id": req.params.postId });
                        save.save()
                            .then((save) => {
                                Saves.findById(save._id)
                                    .populate('user')
                                    .populate('posts')
                                    .then((save) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(save);
                                    })
                            })
                            .catch((err) => {
                                return next(err);
                            });
                    })
                    .catch((err) => {
                        return next(err);
                    })
            }
            else {
                if (save.posts.indexOf(req.params.postId) < 0) {
                    save.posts.push({ "_id": req.params.postId });
                    save.save()
                        .then((save) => {
                            Saves.findById(save._id)
                                .populate('user')
                                .populate('posts')
                                .then((save) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(save);
                                })
                        })
                        .catch((err) => {
                            return next(err);
                        })
                }
                else {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.end('Post ' + req.params.postId + ' already added');
                }
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT operation not supported on /saves/' + req.params.postId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Saves.findOne({ user: req.user._id }, (err, save) => {
            if (err) return next(err);

            console.log(save);
            var index = save.posts.indexOf(req.params.postId)
            if (index >= 0) {
                save.posts.splice(index, 1);
                save.save()
                    .then((save) => {
                        Saves.findById(save._id)
                            .populate('user')
                            .populate('posts')
                            .then((save) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(save);
                            })
                    })
                    .catch((err) => {
                        return next(err);
                    })
            }
            else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end('Post ' + req.params._id + ' not in your saves');
            }

        });
    });

module.exports = saveRouter;
