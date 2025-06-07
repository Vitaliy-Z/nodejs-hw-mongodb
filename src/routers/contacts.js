import { json, Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIDController,
  createContactController,
  updateContactController,
  removeContact,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId(),
  ctrlWrapper(getContactByIDController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  json(),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  json(),
  isValidId(),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

contactsRouter.delete('/:contactId', isValidId(), ctrlWrapper(removeContact));

export default contactsRouter;
