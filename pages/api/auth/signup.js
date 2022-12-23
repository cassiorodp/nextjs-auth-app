import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const { email, password } = data;

    if (
      !email ||
      !email.includes('@') ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }

    try {
      const client = await connectToDatabase();

      const db = client.db();

      const existingUser = await db.collection('users').findOne({ email });

      if (existingUser) {
        res.status(422).json({ message: 'User exists already!' });
        client.close();
        return;
      }

      const hashedPassword = await hashPassword(password);

      const result = await db
        .collection('users')
        .insertOne({ email, password: hashedPassword });

      res.status(201).json({ message: 'Created user!' });
      client.close();
    } catch (error) {
      res.status(500).json({ message: 'Error creating user.' });
    }
  }
}

export default handler;
