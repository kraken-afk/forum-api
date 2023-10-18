import { Jwt } from '~/domains/security/jwt';
import { JwtRepository } from '~/infrastructure/repository/jwt-repository';

export const jwt = new Jwt(new JwtRepository());
