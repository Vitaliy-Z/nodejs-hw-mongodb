import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import 'dotenv/config';
import initMongoConnection from './db/initMongoConnection.js';
import { contactModel } from './models/constacts.js';

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

  app.get('/contacts', async (req, res) => {
    const contacts = await contactModel.find();

    res.json({
      status: 200,
      message:
        contacts.length > 0
          ? 'Successfully found contacts!'
          : 'Contacts is empty',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await contactModel.findById(contactId);

    if (contact === null) {
      res.json({
        status: 404,
        message: `Contact with id ${contactId} not found!`,
      });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.json({
      message: 'Not found',
    });
  });

  try {
    await initMongoConnection();

    const PORT = process.env.PORT || 3000;

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
