var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var cors = require('./cors');

var Pages = require('../models/pages');

var pageRouter = express.Router();

pageRouter.use(bodyParser.json());

pageRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Pages.find(req.query)
            .sort({ title: 1 })
            .populate('owner')
            .then((pages) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(pages);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.owner = req.user._id;
        Pages.create(req.body)
            .then((page) => {
                Pages.findById(page._id)
                    .populate('owner')
                    .then((page) => {
                        console.log('page Created ', page);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(page);
                    })
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /pages');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Pages.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

pageRouter.route('/:pageId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Pages.findById(req.params.pageId)
            .populate('owner')
            .then((page) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(page);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /pages/' + req.params.pageId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Pages.findByIdAndUpdate(req.params.pageId, {
            $set: req.body
        }, { new: true })
            .populate('owner')
            .then((page) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(page);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Pages.findByIdAndRemove(req.params.pageId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = pageRouter;