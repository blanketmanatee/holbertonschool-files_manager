import sha1 from 'sha1';
import DBClient from '../utils/db';

const Bull = require('bull');

class UsersController {
  static async postNew(request, response) {
    const userQueue = new Bull('userQueue');
    const userEmail = request.body.email;
    if (!userEmail) return response.status(400).json({ error: 'Missing email' });

    const userPw = request.body.password;
    if (!userPw) return response.status(400).json({ error: 'Missing password' });

    const existEmail = await DBClient.users.find({ email: userEmail }).toArray();
    if (existEmail) return response.status(400).json({ error: 'Already exists' });

    const hashPw = sha1(userPw);
    const newUser = await DBClient.insertOne({ email: userEmail, password: hashPw });

    userQueue.add({ userId: newUser.id });
    response.statusCode = 201;
    return response.json(newUser);
  }
}

module.exports = UsersController;
