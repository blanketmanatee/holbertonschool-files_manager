import DBClient from '../utils/db';

const sha1 = require('sha1');

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) response.status(400).json({ error: 'Missing email' });
    else if (!password) response.status(400).json({ error: 'Missing password' });
    else {
      const database = await DBClient.connection;
      const collection = database.collection('users');
      const user = await collection.findOne({ email });

      if (user !== null) response.status(400).json({ error: 'Already exist' });
      else {
        const hashedPw = sha1(password);
        collection.insertOne({ email, password: hashedPw }, (error, results) => {
          const newUser = results.ops[0];
          response.status(201).json({ id: newUser._id, email: newUser.email });
        });
      }
    }
  }
}

module.exports = UsersController;
