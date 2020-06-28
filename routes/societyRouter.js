var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

var Societies = require('../models/societies');

var societyRouter = express.Router();

societyRouter.use(bodyParser.json());

societyRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Societies.find(req.query)
            .then((societies) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(societies);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Societies.create(req.body)
            .then((society) => {
                console.log('Society Created ', society);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(society);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /societies');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Societies.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

societyRouter.route('/:societyId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Societies.findById(req.params.societyId)
            .then((society) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(society);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /societies/' + req.params.societyId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Societies.findByIdAndUpdate(req.params.societyId, {
            $set: req.body
        }, { new: true })
            .then((society) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(society);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Societies.findByIdAndRemove(req.params.societyId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = societyRouter;