import type {JWK} from 'jose';
import * as ed from '@noble/ed25519';
import {
  KeyBase,
  KeyTypeSymbol
} from './types';

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
        key.d = Buffer.from(jwk.d, 'base64');
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

        key.x = Buffer.from(jwk.x, 'base64');
      }

      return Promise.resolve(key as Ed25519Key);
    });
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
