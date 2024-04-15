import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { HTTP_STATUS_UNAUTHORIZED } from './http.status';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (user) {
      return user;
    }

    throw new HttpException('Unauthorized', HTTP_STATUS_UNAUTHORIZED);
  },
);
