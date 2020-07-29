var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

var Events = require('../models/events');

var eventRouter = express.Router();

eventRouter.use(bodyParser.json());

eventRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Events.find(req.query)
            .then((events) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(events.reverse());
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Events.create(req.body)
            .then((event) => {
                console.log('Event Created ', event);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /events');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Events.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

eventRouter.route('/:eventId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Events.findById(req.params.eventId)
            .then((event) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /events/' + req.params.eventId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Events.findByIdAndUpdate(req.params.eventId, {
            $set: req.body
        }, { new: true })
            .then((event) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Events.findByIdAndRemove(req.params.eventId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = eventRouter;