var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var cors = require('./cors');

var Posts = require('../models/posts');

var postRouter = express.Router();

postRouter.use(bodyParser.json());

postRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Posts.find({})
            .sort({ createdAt: -1 })
            .skip(parseInt(req.query.offset))
            .limit(parseInt(req.query.limit))
            .populate('owner')
            .then((posts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(posts);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.owner = req.user._id;
        Posts.create(req.body)
            .then((post) => {
                Posts.findById(post._id)
                    .populate('owner')
                    .then((post) => {
                        console.log('Post Created ', post);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(post);
                    })
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /posts');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Posts.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

postRouter.route('/:postId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Posts.findById(req.params.postId)
            .populate('owner')
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /posts/' + req.params.postId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Posts.findByIdAndUpdate(req.params.postId, {
            $set: req.body
        }, { new: true })
            .populate('owner')
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Posts.findByIdAndRemove(req.params.postId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = postRouter;