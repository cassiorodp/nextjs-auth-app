import { getSession } from 'next-auth/client';
import { hashPassword, verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreValid = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreValid) {
    res.status(403).json({ message: 'Invalid password.' });
    client.close();
    return;
  }

  try {
    const hashedPassword = await hashPassword(newPassword);

    const result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword } }
    );

    client.close();
    res.status(200).json({ message: 'Password updated!' });
  } catch (error) {
    res.status(500).json({ message: 'Password could not be updated.' });
    client.close();
    return;
  }
}

export default handler;
