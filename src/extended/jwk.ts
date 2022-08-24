import type {
  JWK,
  KeyLike
} from 'jose';
import {JoseType} from '../types';
import {ed25519ImportKey} from './eddsa';

export function importJWK(joseOriginal: JoseType, joseExtended: JoseType, jwk: JWK, alg?: string, octAsKeyObject?: boolean): Promise<KeyLike | Uint8Array> {
  if (jwk.kty === 'OKP' && jwk.crv === 'Ed25519') {
    return ed25519ImportKey(jwk);
  }
  return joseOriginal.importJWK.apply(null, [jwk, alg, octAsKeyObject]);
}
