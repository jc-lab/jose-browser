import type {
  KeyLike
} from 'jose';

export const KeyTypeSymbol = Symbol('keyType');

export interface KeyBase extends KeyLike {
  type: 'public' | 'private';
  [KeyTypeSymbol]: string;
}

export type SignFunction = (key: any, message: Uint8Array) => Promise<Uint8Array>;
export type VerifyFunction = (key: any, sig: Uint8Array, message: Uint8Array) => Promise<boolean>;
