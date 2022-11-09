
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateIntegrationInput {
    id: string;
}

export class IntegrationStep {
    __typename?: 'IntegrationStep';
    step: string;
    id: string;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract createIntegration(createIntegrationInput: CreateIntegrationInput): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    __typename?: 'ISubscription';

    abstract integrationCreated(id: string): Nullable<Nullable<IntegrationStep>[]> | Promise<Nullable<Nullable<IntegrationStep>[]>>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract hello(): string | Promise<string>;
}

type Nullable<T> = T | null;
