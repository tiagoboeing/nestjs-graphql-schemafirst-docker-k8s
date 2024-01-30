import { GraphQLExecutionContext } from '@nestjs/graphql';
import { CustomRequest } from './types/graphql-context';

export interface Context extends GraphQLExecutionContext {
  req: CustomRequest;
  headers: Headers;
}

export const context = ({ req }) => ({
  headers: req.headers,
  req,
});
