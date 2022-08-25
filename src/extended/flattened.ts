import type {
  FlattenedJWSInput,
  FlattenedVerifyResult,
  KeyLike,
  ResolvedKey,
  VerifyOptions,
  FlattenedVerifyGetKey,
  JWSHeaderParameters,
  FlattenedSign,
  SignOptions,
  FlattenedJWS
} from 'jose';
import {
  JoseType
} from '../types';
import {
  concat,
  decoder,
  encoder,
  isObject
} from './utils';
import algorithms from './algorithms';

export function flattenedVerify(jose: JoseType, joseExtended: JoseType, jws: FlattenedJWSInput, key: KeyLike | Uint8Array, options?: VerifyOptions): Promise<FlattenedVerifyResult>;
export function flattenedVerify(jose: JoseType, joseExtended: JoseType, jws: FlattenedJWSInput, getKey: FlattenedVerifyGetKey, options?: VerifyOptions): Promise<FlattenedVerifyResult & ResolvedKey>;
export function flattenedVerify(jose: JoseType, joseExtended: JoseType, jws: FlattenedJWSInput, keyOrGet: KeyLike | Uint8Array | FlattenedVerifyGetKey, options?: VerifyOptions): Promise<FlattenedVerifyResult | (FlattenedVerifyResult & ResolvedKey)> {
  if (!isObject(jws)) {
    return Promise.reject(new jose.errors.JWSInvalid('Flattened JWS must be an object'));
  }

  if (jws.protected === undefined && jws.header === undefined) {
    return Promise.reject(new jose.errors.JWSInvalid('Flattened JWS must have either of the "protected" or "header" members'));
  }

  if (jws.protected !== undefined && typeof jws.protected !== 'string') {
    return Promise.reject(new jose.errors.JWSInvalid('JWS Protected Header incorrect type'));
  }

  if (jws.payload === undefined) {
    return Promise.reject(new jose.errors.JWSInvalid('JWS Payload missing'));
  }

  if (typeof jws.signature !== 'string') {
    return Promise.reject(new jose.errors.JWSInvalid('JWS Signature missing or incorrect type'));
  }

  if (jws.header !== undefined && !isObject(jws.header)) {
    return Promise.reject(new jose.errors.JWSInvalid('JWS Unprotected Header incorrect type'));
  }

  let parsedProt: JWSHeaderParameters = {}
  if (jws.protected) {
    try {
      const protectedHeader = jose.base64url.decode(jws.protected)
      parsedProt = JSON.parse(decoder.decode(protectedHeader))
    } catch {
      return Promise.reject(new jose.errors.JWSInvalid('JWS Protected Header is invalid'));
    }
  }

  const joseHeader: JWSHeaderParameters = {
    ...parsedProt,
    ...jws.header
  }

  if (typeof joseHeader.alg !== 'string' || !joseHeader.alg) {
    return Promise.reject(new jose.errors.JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid'));
  }

  if (typeof jws.payload !== 'string') {
    return Promise.reject(new jose.errors.JWSInvalid('JWS Payload must be a string'));
  }

  const algorithm = algorithms.find(a => a.checkHeader(joseHeader));
  if (algorithm) {
    let resolvedKey: any = false
    return Promise.resolve()
      .then(() => {
        if (typeof keyOrGet === 'function') {
          return Promise.resolve(keyOrGet(parsedProt, jws))
            .then((res) => {
              resolvedKey = res;
              return res;
            });
        } else {
          return keyOrGet;
        }
      })
      .then((key) => {
        const data = concat(
          encoder.encode(jws.protected ?? ''),
          encoder.encode('.'),
          typeof jws.payload === 'string' ? encoder.encode(jws.payload) : jws.payload,
        );
        const signature = jose.base64url.decode(jws.signature);
        return algorithm.verify(key, signature, data);
      })
      .then((verified) => {
        if (!verified) {
          return Promise.reject(new jose.errors.JWSSignatureVerificationFailed());
        }
        const payload = jose.base64url.decode(jws.payload);
        const result: FlattenedVerifyResult = { payload };
        if (jws.protected !== undefined) {
          result.protectedHeader = parsedProt;
        }
        if (jws.header !== undefined) {
          result.unprotectedHeader = jws.header;
        }
        if (resolvedKey) {
          return {
            ...result,
            key: resolvedKey
          }
        }
        return result;
      });
  }

  return jose.flattenedVerify.apply(null, [jws, keyOrGet, options]);
}

export function makeFlattenedSign(jose: JoseType, joseExtended: JoseType): typeof FlattenedSign {
  class NewFlattenedSign extends jose.FlattenedSign {
    sign(key: KeyLike | Uint8Array, options?: SignOptions): Promise<FlattenedJWS> {
      const _protectedHeader = (this as any)._protectedHeader;
      const _unprotectedHeader = (this as any)._unprotectedHeader;
      const _payload = (this as any)._payload;

      if (!_protectedHeader && !_unprotectedHeader) {
        return Promise.reject(new jose.errors.JWSInvalid(
          'either setProtectedHeader or setUnprotectedHeader must be called before #sign()',
        ));
      }

      const joseHeader: JWSHeaderParameters = {
        ..._protectedHeader,
        ..._unprotectedHeader
      }

      const algorithm = algorithms.find(a => a.checkHeader(joseHeader));
      if (algorithm) {
        let protectedHeader: Uint8Array;
        if (_protectedHeader) {
          protectedHeader = encoder.encode(jose.base64url.encode(JSON.stringify(_protectedHeader)))
        } else {
          protectedHeader = encoder.encode('')
        }

        const payload = encoder.encode(jose.base64url.encode(_payload as Uint8Array));
        const data = concat(protectedHeader, encoder.encode('.'), payload);

        return algorithm.sign(key, data)
          .then((signature) => {
            const jws: FlattenedJWS = {
              signature: jose.base64url.encode(signature),
              payload: decoder.decode(payload)
            }

            if (_unprotectedHeader) {
              jws.header = _unprotectedHeader
            }

            if (_protectedHeader) {
              jws.protected = decoder.decode(protectedHeader)
            }

            return jws
          });
      }

      return super.sign(key);
    }
  }

  return NewFlattenedSign;
}
