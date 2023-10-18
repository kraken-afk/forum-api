import { Authentications } from '~/domains/models/authentications';
import { db } from '~/infrastructure/database/db';
import { AuthenticationsRepository } from '~/infrastructure/repository/authentications-repository';

export const authentications = new Authentications(
  new AuthenticationsRepository(db),
);
