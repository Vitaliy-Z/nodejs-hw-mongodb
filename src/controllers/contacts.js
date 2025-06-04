import createHttpError from 'http-errors';
import {
  findAllContacts,
  findContactByID,
  createContact,
  updateContact,
  deleteContact,
} from '../sevices/contacts.js';
import {
  parseFilterParams,
  parsePaginationParams,
  parseSortParams,
} from '../utils/parseQueryParams.js';

export async function getAllContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const data = await findAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message:
      data.data.length > 0
        ? 'Successfully found contacts!'
        : 'Contacts is empty',
    data,
  });
}

export async function getContactByIDController(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await findContactByID(contactId, userId);

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
  const newContact = await createContact({ ...req.body, userId: req.user._id });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

export async function updateContactController(req, res) {
  const updatedContact = await updateContact(
    req.params.contactId,
    req.user._id,
    req.body,
  );

  if (updatedContact === null) {
    throw createHttpError(
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
  const deletedContact = await deleteContact(
    req.params.contactId,
    req.user._id,
  );

  if (deletedContact === null) {
    throw createHttpError(
      404,
      `Contact with id ${req.params.contactId} not found`,
    );
  }

  res.status(204).end();
}
