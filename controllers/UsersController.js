import DBClient from '../utils/db';
import redisClient from '../utils/redis';
import crypto from 'crypto';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email)
      return response.status(400).json({ error: 'Missing email' });
    if (!password)
      return response.status(400).json({ error: 'Missing password' });

    const users = await DBClient.db.collection('users');
    const existUser = await users.find({ email }).toArray();
    if (existUser.length > 0)
      return response.status(400).json({ error: 'Already exist' });

    const hashPw = crypto.createHash('SHA1').update(password).digest('hex');
    const createUser = await users.insertOne({ email, password: hashPw });
    const newUser = { id: createUser.insertedId, email };
    return response.status(201).json(newUser);
  }
}

module.exports = UsersController;
