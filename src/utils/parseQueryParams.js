const parseNumber = (number, defaultValue) =>
  Number.isNaN(parseInt(number)) ? defaultValue : parseInt(number);

export const parsePaginationParams = (query) => {
  const { page: pageQuery, perPage: perPageQuery } = query;
  return {
    page: parseNumber(pageQuery, 1),
    perPage: parseNumber(perPageQuery, 10),
  };
};

const parseSortBy = (sortBy) =>
  ['name', 'createdAt'].includes(sortBy) ? sortBy : 'createdAt';

const parseSortOrder = (sortOrder) =>
  ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc';

export const parseSortParams = (query) => {
  const { sortBy: sortByQuery, sortOrder: sortOrderQuery } = query;
  return {
    sortBy: parseSortBy(sortByQuery),
    sortOrder: parseSortOrder(sortOrderQuery),
  };
};

const parseType = (type) =>
  ['work', 'home', 'personal'].includes(type) ? type : null;

const parseValue = (value) => (value ? value : null);

const parseIsFavourite = (isFavorit) =>
  isFavorit === 'true' ? true : isFavorit === 'false' ? false : null;

export const parseFilterParams = (query) => {
  const { type, phone, name, email, isFavourite } = query;
  return {
    contactType: parseType(type),
    phoneNumber: parseValue(phone),
    name: parseValue(name),
    email: parseValue(email),
    isFavourite: parseIsFavourite(isFavourite),
  };
};
