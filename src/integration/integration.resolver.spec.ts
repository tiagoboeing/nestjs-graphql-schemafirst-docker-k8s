import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationResolver } from './integration.resolver';
import { IntegrationService } from './integration.service';

describe('IntegrationResolver', () => {
  let resolver: IntegrationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegrationResolver, IntegrationService],
    }).compile();

    resolver = module.get<IntegrationResolver>(IntegrationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
