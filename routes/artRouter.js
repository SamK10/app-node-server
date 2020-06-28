var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var cors = require('./cors');

var Arts = require('../models/arts');

var artRouter = express.Router();

artRouter.use(bodyParser.json());

artRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Arts.find(req.query)
            .then((arts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(arts);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Arts.create(req.body)
            .then((art) => {
                console.log('Art Created ', art);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(art);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /arts');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Arts.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

artRouter.route('/:artId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Arts.findById(req.params.artId)
            .then((art) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(art);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /arts/' + req.params.artId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Arts.findByIdAndUpdate(req.params.artId, {
            $set: req.body
        }, { new: true })
            .then((art) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(art);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Arts.findByIdAndRemove(req.params.artId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = artRouter;