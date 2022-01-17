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
route.get('/connect', ((request, response) => AuthController.getConnect(request, response)));
route.get('/disconnect', ((request, response) => AuthController.getDisconnect(request, response)));
route.get('users/me', ((request, response) => UserController.getMe (request, response)));
route.post('/files', ((request, response) => FilesController.postUpload (request, response)));
route.get('/files/:id', ((request, response) => FilesController.getShow (request, response)));
route.get('/files', ((request, response) => FilesController.getIndex(request, response)));
route.put('/files/:id/publish', ((request, response) => FilesController.putPublish(request, response)));
route.put('/files/:id/publish', ((request, response) => FilesController.putUnpublish(request, response)));
route.get('/files/:id/data', ((request, response) => FilesController.getFile(request, response)));


};

export default router;