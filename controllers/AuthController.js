import { v4 as uuidv4 } from 'uuid';
import DBClient from '../utils/db';
import redisClient from '../utils/redis';

const sha1 = require('sha1');

class AuthController {
  static async getConnect(request, response) {
    const auth = request.header('Authorization') || null;
    if (!auth) return response.status(401).send({ error: 'Unauthorized' });

    const authToken = auth.split(' ')[1];
    const decoded = Buffer.from(authToken, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');
    if (!email || !password) return response.status(401).json({ error: 'Unauthorized' });
    const user = await DBClient.db.collection('users').findOne({
      email,
      password: sha1(password),
    });

    if (!user) response.status(401).json({ error: 'Unauthorized' });
    const token = uuidv4();
    const userKey = `auth_${token}`;

    await redisClient.set(userKey, user._id.toString(), 60 * 60 * 24);
    return response.status(200).json({ token });
  }

  static async getDisconnect(request, response) {
    const invalidToken = request.headers['x-token'];
    const invalidKey = `auth_${invalidToken}`;

    const user = await redisClient.get(invalidKey);
    if (!user) response.status(401).json({ error: 'Unauthorized' });
    else {
      await redisClient.del(invalidKey);
      response.status(204).send();
    }
  }
}

module.exports = AuthController;
