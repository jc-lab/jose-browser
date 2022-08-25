import type {JWK} from 'jose';
import * as ed from '@noble/ed25519';
import {
  Algorithm,
  KeyBase,
  KeyTypeSymbol
} from './types';
import {KeyLike} from 'jose';
import {
  base64FromUrlSafe,
  base64ToUrlSafe
} from './utils';

export interface Ed25519Key extends KeyBase {
  type: 'public' | 'private';
  [KeyTypeSymbol]: 'ed25519';
  x: Uint8Array;
  d?: Uint8Array;
}

export function ed25519ImportKey(jwk: JWK): Promise<Ed25519Key> {
  const isPrivate = !!jwk.d;
  const key: Partial<Ed25519Key> = {
    type: isPrivate ? 'private' : 'public',
    [KeyTypeSymbol]: 'ed25519'
  };

  return Promise.resolve()
    .then(() => {
      if (isPrivate) {
        key.d = Buffer.from(base64FromUrlSafe(jwk.d), 'base64');
        return ed.getPublicKey(key.d)
          .then((x) => {
            key.x = x
          });
      }
    })
    .then(() => {
      if (!key.x) {
        if (!jwk.x) {
          return Promise.reject(new Error('required \'x\''));
        }

        key.x = Buffer.from(base64FromUrlSafe(jwk.x), 'base64');
      }

      return Promise.resolve(key as Ed25519Key);
    });
}

export function ed25519ExportKey(key: KeyLike | Uint8Array): Promise<JWK> {
  const keyImpl = key as Ed25519Key;
  const jwk: JWK = {
    alg: 'EdDSA',
    kty: 'OKP',
    crv: 'Ed25519',
    x: base64ToUrlSafe(Buffer.from(keyImpl.x).toString('base64'))
  };
  if (keyImpl.type === 'private') {
    jwk.d = base64ToUrlSafe(Buffer.from(keyImpl.d).toString('base64'));
  }
  return Promise.resolve(jwk);
}

export function ed25519Sign(key: any, message: Uint8Array): Promise<Uint8Array> {
  const keyImpl = key as Ed25519Key;
  return ed.sign(message, keyImpl.d);
}

export function ed25519Verify(key: any, sig: Uint8Array, message: Uint8Array): Promise<boolean> {
  const keyImpl = key as Ed25519Key;
  return ed.verify(sig, message, keyImpl.x)
    .catch(() => false);
}

export const ed25519: Algorithm = {
  name: 'ed25519',
  checkJwk(jwk: JWK): boolean {
    return (jwk.kty === 'OKP' && jwk.crv === 'Ed25519');
  },
  checkKey(key: KeyLike | Uint8Array): boolean {
    return (key[KeyTypeSymbol] === ed25519.name);
  },
  checkHeader(header: { alg: string }): boolean {
    return (header.alg === 'EdDSA');
  },
  sign: ed25519Sign,
  verify: ed25519Verify,
  importKey: ed25519ImportKey,
  exportKey: ed25519ExportKey
};
