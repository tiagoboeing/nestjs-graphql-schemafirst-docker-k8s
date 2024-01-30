
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateNotificationInput {
    topic: string;
    message: string;
    email?: Nullable<string>;
}

export interface Notification {
    __typename?: 'Notification';
    id: string;
    topic: string;
    message: string;
    email?: Nullable<string>;
    createdAt: DateTime;
}

export interface ISubscription {
    __typename?: 'ISubscription';
    notificationCreated(topic: string): Notification | Promise<Notification>;
}

export interface IQuery {
    __typename?: 'IQuery';
    notification(id: string): Nullable<Notification> | Promise<Nullable<Notification>>;
    hello(): string | Promise<string>;
}

export interface IMutation {
    __typename?: 'IMutation';
    createNotification(createNotificationInput: CreateNotificationInput): Notification | Promise<Notification>;
}

export type DateTime = any;
export type Time = any;
export type DateTimeISO = any;
export type Timestamp = any;
export type TimeZone = any;
export type UtcOffset = any;
export type Duration = any;
export type ISO8601Duration = any;
export type LocalDate = any;
export type LocalTime = any;
export type LocalDateTime = any;
export type LocalEndTime = any;
export type EmailAddress = any;
export type NegativeFloat = any;
export type NegativeInt = any;
export type NonEmptyString = any;
export type NonNegativeFloat = any;
export type NonNegativeInt = any;
export type NonPositiveFloat = any;
export type NonPositiveInt = any;
export type PhoneNumber = any;
export type PositiveFloat = any;
export type PositiveInt = any;
export type PostalCode = any;
export type UnsignedFloat = any;
export type UnsignedInt = any;
export type URL = any;
export type BigInt = any;
export type Long = any;
export type Byte = any;
export type UUID = any;
export type GUID = any;
export type Hexadecimal = any;
export type HexColorCode = any;
export type HSL = any;
export type HSLA = any;
export type IP = any;
export type IPv4 = any;
export type IPv6 = any;
export type ISBN = any;
export type JWT = any;
export type Latitude = any;
export type Longitude = any;
export type MAC = any;
export type Port = any;
export type RGB = any;
export type RGBA = any;
export type SafeInt = any;
export type USCurrency = any;
export type Currency = any;
export type JSON = any;
export type JSONObject = any;
export type IBAN = any;
export type ObjectID = any;
export type Void = any;
export type DID = any;
export type CountryCode = any;
export type Locale = any;
export type RoutingNumber = any;
export type AccountNumber = any;
export type Cuid = any;
export type SemVer = any;
export type DeweyDecimal = any;
export type LCCSubclass = any;
export type IPCPatent = any;
type Nullable<T> = T | null;
