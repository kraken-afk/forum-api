import { Comments } from '~/domains/models/comments';
import { db } from '~/infrastructure/database/db';
import { CommentsRepository } from '~/infrastructure/repository/comments-repository';

export const comments = new Comments(new CommentsRepository(db));
