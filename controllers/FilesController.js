import Bull from 'bull';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class FilesController {
    static async postUpload(request, response) {
        const fileQueue = new Bull('fileQueue');

        const token = request.header('X-Token') || null;
        if (!token) return response.status(401).send({ error: 'Unauthorized' });
        
        const redisToken = await RedisClient.get(`auth_${token}`);
        if (!redisToken) return response.status(401).send({ error: 'Unauthorized' });

        const user = await DBClient.db.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) return response.status(400).send({ error: 'Missing name' });

        const fileName = request.body.name;
        if (!fileName) return response.status(400).send({ error: 'Missing name' });

        const fileType = request.body.type;
        if (!fileType || !['folder', 'file', 'image'].includes(fileType)) return response.status(400).send({ error: 'Missing type' });

        const fileData = request.body.data;
        if (!fileData && ['file', 'image'].includes(fileType)) return response.status(400).send({ error: 'Missing data' });

        
    }
}