import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

//
interface CustomRequest extends Request {
  // Put custom properties here
  token?: string;
}

declare module '@nestjs/graphql' {
  interface GraphQLExecutionContext extends GqlExecutionContext {
    req: CustomRequest;
    res: Response;
  }
}
