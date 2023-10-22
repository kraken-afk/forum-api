import { Replies } from '~/domains/models/replies';
import { db } from '~/infrastructure/database/db';
import { RepliesRepository } from '~/infrastructure/repository/replies-repository';

export const replies = new Replies(new RepliesRepository(db));
