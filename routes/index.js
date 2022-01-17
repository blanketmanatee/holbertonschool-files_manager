import AppController from '../controllers/AppController';

const express = require('express');

const router = (app) => {
    const route = express.Router();
    app.use(express.json());
    app.use('/', route);

route.get('/status', ((request, response) => AppController.getStatus(request, response)));
route.get('/stats', ((request, response) => AppController.getStats(request, response)));
route.post('/users', ((request, response) => UsersControllers.postNew(request, response)));

};

export default router;