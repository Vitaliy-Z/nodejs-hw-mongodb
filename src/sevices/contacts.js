import createHttpError from 'http-errors';
import { contactModel } from '../db/models/models.js';

export const findAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  if (page < 1) {
    page = 1;
  }

  const { contactType, phoneNumber, name, email, isFavourite } = filter;

  const contactQueryModel = contactModel.find({ userId });

  contactType && contactQueryModel.where('contactType').equals(contactType);
  phoneNumber &&
    contactQueryModel.where('phoneNumber').regex(new RegExp(phoneNumber, 'i'));
  name && contactQueryModel.where('name').regex(new RegExp(name, 'i'));
  email &&
    contactQueryModel
      .where('email')
      .regex(new RegExp(`${email}(?=[^@]*@)`, 'i'));
  isFavourite !== null &&
    contactQueryModel.where('isFavourite').equals(isFavourite);

  const totalItems = await contactModel.countDocuments(contactQueryModel);
  const totalPages = Math.ceil(totalItems / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = page > 1 ? (page - 1) * perPage : 0;
  const data = await contactQueryModel
    .find()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const findContactByID = (contactId, userId) => {
  return contactModel.findOne({ _id: contactId, userId });
};

export const createContact = async (data) => {
  const contact = await contactModel.findOne({
    phoneNumber: data.phoneNumber,
    userId: data.userId,
  });

  if (contact !== null) {
    throw new createHttpError(
      400,
      `Contact with phone ${data.phoneNumber} is exist`,
    );
  }

  return contactModel.create(data);
};

export const updateContact = (id, userId, data) => {
  return contactModel.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
  });
};

export const deleteContact = (id, userId) => {
  return contactModel.findOneAndDelete({ _id: id, userId });
};
