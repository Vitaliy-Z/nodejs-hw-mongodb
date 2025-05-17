import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import 'dotenv/config';
import initMongoConnection from './db/initMongoConnection.js';

import contactsRouter from './routers/contacts.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

export default async function setupServer() {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  try {
    await initMongoConnection();

    const PORT = process.env.PORT || 3333;

    return app.listen(PORT, (err) => {
      if (err) {
        throw err;
      }
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}
