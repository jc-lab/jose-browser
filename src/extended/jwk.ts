import type {
  JWK,
  KeyLike
} from 'jose';
import {
  JoseType
} from '../types';
import algorithms from './algorithms';

export function importJWK(joseOriginal: JoseType, joseExtended: JoseType, jwk: JWK, alg?: string, octAsKeyObject?: boolean): Promise<KeyLike | Uint8Array> {
  const algorithm = algorithms.find(a => a.checkJwk(jwk));
  if (algorithm) {
    return algorithm.importKey(jwk);
  }
  return joseOriginal.importJWK.apply(null, [jwk, alg, octAsKeyObject]);
}

export function exportJWK(joseOriginal: JoseType, joseExtended: JoseType, key: KeyLike | Uint8Array): Promise<JWK> {
  const algorithm = algorithms.find(a => a.checkKey(key));
  if (algorithm) {
    return algorithm.exportKey(key);
  }
  return joseOriginal.exportJWK.apply(null, [key]);
}
