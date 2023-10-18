import { Users } from '~/domains/models/users';
import { db } from '~/infrastructure/database/db';
import { UsersRepository } from '~/infrastructure/repository/users-repository';

export const users = new Users(new UsersRepository(db));
