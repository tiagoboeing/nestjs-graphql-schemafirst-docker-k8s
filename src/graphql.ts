
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateIntegrationInput {
    exampleField?: Nullable<number>;
}

export class UpdateIntegrationInput {
    id: number;
}

export class Integration {
    __typename?: 'Integration';
    std?: Nullable<string>;
    sat?: Nullable<string>;
    status?: Nullable<string>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract integrations(): Nullable<Integration>[] | Promise<Nullable<Integration>[]>;

    abstract integration(id: number): Nullable<Integration> | Promise<Nullable<Integration>>;

    abstract hello(): string | Promise<string>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract createIntegration(createIntegrationInput: CreateIntegrationInput): Integration | Promise<Integration>;

    abstract updateIntegration(updateIntegrationInput: UpdateIntegrationInput): Integration | Promise<Integration>;

    abstract removeIntegration(id: number): Nullable<Integration> | Promise<Nullable<Integration>>;
}

export abstract class ISubscription {
    __typename?: 'ISubscription';

    abstract integrationCreated(): Nullable<Integration> | Promise<Nullable<Integration>>;

    abstract integrationUpdated(): Integration | Promise<Integration>;

    abstract integrationRemoved(): Integration | Promise<Integration>;
}

type Nullable<T> = T | null;
