import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { typeDefs as scalarTypeDefs } from 'graphql-scalars';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./**/*.graphql'],
  typeDefs: [...scalarTypeDefs],
  path: join(process.cwd(), 'src/graphql.ts'),
  outputAs: 'interface',
  emitTypenameField: true,
});
