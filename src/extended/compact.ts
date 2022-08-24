import type {
  CompactVerifyGetKey,
  CompactVerifyResult,
  KeyLike,
  ResolvedKey,
  VerifyOptions,
  CompactSign,
  SignOptions,
  FlattenedSign, CompactJWSHeaderParameters
} from 'jose';
import {
  JoseType
} from '../types';
import {decoder} from './utils';
import {flattenedVerify} from './flattened';

export function compactVerify(jose: JoseType, joseExtended: JoseType, jws: string | Uint8Array, key: KeyLike | Uint8Array, options?: VerifyOptions): Promise<CompactVerifyResult>;
export function compactVerify(jose: JoseType, joseExtended: JoseType, jws: string | Uint8Array, getKey: CompactVerifyGetKey, options?: VerifyOptions): Promise<CompactVerifyResult & ResolvedKey>;
export function compactVerify(jose: JoseType, joseExtended: JoseType, jws: string | Uint8Array, key: KeyLike | Uint8Array | CompactVerifyGetKey, options?: VerifyOptions): Promise<CompactVerifyResult | (CompactVerifyResult & ResolvedKey)> {
  const textJws: string = (jws instanceof Uint8Array) ? decoder.decode(jws) : jws;
  const { 0: protectedHeader, 1: payload, 2: signature, length } = textJws.split('.');
  if (length !== 3) {
    return Promise.reject(new jose.errors.JWSInvalid('Invalid Compact JWS'));
  }

  return flattenedVerify(
    jose,
    joseExtended,
    { payload, protected: protectedHeader, signature },
    <Parameters<typeof flattenedVerify>[3]>key,
    options,
  )
    .then((verified) => {
      const result = { payload: verified.payload, protectedHeader: verified.protectedHeader! };

      if (typeof key === 'function') {
        return { ...result, key: verified.key };
      }

      return result as any;
    });
}

export function makeCompactSign(jose: JoseType, joseExtended: JoseType): typeof CompactSign {
  class NewCompactSign extends jose.CompactSign {
    private readonly _flattenedImpl: FlattenedSign;

    constructor(payload: Uint8Array) {
      super(payload);
      this._flattenedImpl = new joseExtended.FlattenedSign(payload);
    }

    setProtectedHeader(protectedHeader: CompactJWSHeaderParameters): this {
      this._flattenedImpl.setProtectedHeader(protectedHeader);
      return this;
    }

    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<string> {
      return this._flattenedImpl.sign(key, options)
        .then((jws) => {
          if (jws.payload === undefined) {
            return Promise.reject(new TypeError('use the flattened module for creating JWS with b64: false'));
          }
          return `${jws.protected}.${jws.payload}.${jws.signature}`;
        });
    }
  }

  return NewCompactSign;
}
