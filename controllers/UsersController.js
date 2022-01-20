import crypto from 'crypto';
import DBClient from '../utils/db';
import redisClient from '../utils/redis';

const Bull = require('bull');
const mongo = require('mongodb');

class UsersController {
  static async postNew(request, response) {
    const userQueue = new Bull('userQueue');
    const { email, password } = request.body;
    if (!email) return response.status(400).json({ error: 'Missing email' });
    if (!password) return response.status(400).json({ error: 'Missing password' });

    const users = await DBClient.db.collection('users');
    const existUser = await users.find({ email }).toArray();
    if (existUser.length > 0) return response.status(400).json({ error: 'Already exist' });

    const hashPw = crypto.createHash('SHA1').update(password).digest('hex');
    const createUser = await users.insertOne({ email, password: hashPw });
    const newUser = { id: createUser.insertedId, email };
    // return response.status(201).json(newUser);

    userQueue.add({ userId: newUser.id });
    response.statusCode = 201;
    return response.json(newUser);
  }

  static async getMe(request, response) {
    const token = request.headers['x-token'];
    const id = await redisClient.get(`auth_${token}`);
    const objectId = new mongo.ObjectID(id);
    const user = await DBClient.db.collection('users').findOne({ _id: objectId });

    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    return response.json({ id, email: user.email });
  }
}

module.exports = UsersController;
