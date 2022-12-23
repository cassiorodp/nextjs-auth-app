import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);

    return client;
  } catch (error) {
    console.log(error);
  }
}
