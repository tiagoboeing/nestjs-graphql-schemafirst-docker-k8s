
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
    step: string;
}

export abstract class IMutation {
    abstract createIntegration(createIntegrationInput: CreateIntegrationInput): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract integrationCreated(id: string): Nullable<Nullable<IntegrationStep>[]> | Promise<Nullable<Nullable<IntegrationStep>[]>>;
}

export abstract class IQuery {
    abstract hello(): string | Promise<string>;
}

type Nullable<T> = T | null;
