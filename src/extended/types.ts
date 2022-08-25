import type {
  JWK,
  KeyLike
} from 'jose';

export const KeyTypeSymbol = Symbol('keyType');

export interface KeyBase extends KeyLike {
  type: 'public' | 'private';
  [KeyTypeSymbol]: string;
}

export type SignFunction = (key: any, message: Uint8Array) => Promise<Uint8Array>;
export type VerifyFunction = (key: any, sig: Uint8Array, message: Uint8Array) => Promise<boolean>;
export type ImportKeyFunction = (jwk: JWK) => Promise<KeyLike | Uint8Array>;
export type ExportKeyFunction = (key: KeyLike | Uint8Array) => Promise<JWK>;

export interface Algorithm {
  name: string;
  checkJwk(jwk: JWK): boolean;
  checkKey(key: KeyLike | Uint8Array): boolean;
  checkHeader(header: { alg?: string }): boolean;
  sign: SignFunction;
  verify: VerifyFunction;
  importKey: ImportKeyFunction;
  exportKey: ExportKeyFunction;
}
