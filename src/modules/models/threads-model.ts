import { Threads } from '~/domains/models/threads';
import { db } from '~/infrastructure/database/db';
import { ThreadsRepository } from '~/infrastructure/repository/threads-repository';

export const threads = new Threads(new ThreadsRepository(db));
