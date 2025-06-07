import { readFileSync } from 'node:fs';
import path from 'node:path';

export const getReserPasswordTemplate = () =>
  readFileSync(path.resolve('src', 'templates', 'reset-password.hbs'), 'UTF-8');
