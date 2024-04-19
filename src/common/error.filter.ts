import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  // catch error exception
  catch(exception: any, host: ArgumentsHost) {
    // define host
    const ctx = host.switchToHttp();
    // get response body
    const response = ctx.getResponse<Response>();
    // get reqeuest body
    const request = ctx.getRequest<Request>();

    // check error exception - http or zod
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        status: exception.getStatus(),
        message: exception.message,
        errors: exception.getResponse(),
        timestamp: new Date().toISOString(),
        url: request.url,
      });
    } else if (exception instanceof ZodError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Validation ERROR',
        errors: exception.errors,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errors: exception.message,
    });
  }
}
