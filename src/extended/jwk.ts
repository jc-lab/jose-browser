import type {
  JWK,
  KeyLike
} from 'jose';
import {JoseType} from '../types';
import {ed25519ImportKey} from './eddsa';

export function importJWK(jose: JoseType, jwk: JWK, alg?: string, octAsKeyObject?: boolean): Promise<KeyLike | Uint8Array> {
  if (jwk.kty === 'OKP' && jwk.crv === 'Ed25519') {
    return ed25519ImportKey(jwk);
  }
  return jose.importJWK.apply([jwk, alg, octAsKeyObject]);
}
