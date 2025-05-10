import mongoose from 'mongoose';

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@c${MONGODB_URL}/?retryWrites=true&w=majority&appName=${MONGODB_DB}`;

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

export default async function initMongoConnection() {
  await mongoose.connect(uri, clientOptions);
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log('Mongo connection successfully established!');
}
