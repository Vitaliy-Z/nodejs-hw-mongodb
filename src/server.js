import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import 'dotenv/config';
import initMongoConnection from './db/initMongoConnection.js';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import { authenticate } from './middlewares/authenticate.js';

export default async function setupServer() {
  const app = express();

  app.use(cors());
  app.use(cookieParser());

  if (process.env.NODE_ENV !== 'development') {
    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
    );
  }
  app.use('/contacts', authenticate, contactsRouter);
  app.use('/auth', express.json(), authRouter);

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
