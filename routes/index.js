import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

function Routing(app) {
  const route = express.Router();
  app.use('/', route);

route.get('/status', (request, response) => { 
  AppController.getStatus(request, response);
});
route.get('/stats', ((request, response) => AppController.getStats(request, response)));
route.post('/users', ((request, response) => UsersController.postNew(request, response)));

}

export default Routing;
