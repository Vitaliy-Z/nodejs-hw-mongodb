import createHttpError from 'http-errors';
import {
  findAllContacts,
  findContactByID,
  createContact,
  updateContact,
  deleteContact,
} from '../sevices/contacts.js';

export async function getAllContactsController(req, res) {
  const contacts = await findAllContacts();

  res.status(200).json({
    status: 200,
    message:
      contacts.length > 0
        ? 'Successfully found contacts!'
        : 'Contacts is empty',
    data: contacts,
  });
}

export async function getContactByIDController(req, res) {
  const { contactId } = req.params;

  const contact = await findContactByID(req.params.contactId);

  if (contact === null) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

export async function updateContactController(req, res) {
  const updatedContact = await updateContact(req.params.contactId, req.body);

  if (updatedContact === null) {
    throw new createHttpError(
      404,
      `Contact with id ${req.params.contactId} is not found`,
    );
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

export async function removeContact(req, res) {
  const deletedContact = await deleteContact(req.params.contactId);

  if (deletedContact === null) {
    throw createHttpError(
      404,
      `Contact with id ${req.params.contactId} not found`,
    );
  }

  res.status(204).end();
}
