import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error('Please enter an email and password');
        }

        const client = await connectToDatabase();

        const usersColleciton = client.db().collection('users');

        const user = await usersColleciton.findOne({ email });

        if (!user) {
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
          throw new Error('Could not log you in!');
        }

        client.close();

        return { email: user.email };
      },
    }),
  ],
});
