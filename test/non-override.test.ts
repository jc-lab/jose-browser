import * as joseOriginal from 'jose';
import { extendJose } from '../src';
const joseNew = extendJose(joseOriginal);

const payload = Buffer.from('HELLO WORLD');

describe('non override', () => {
  it('ES256 sign-and-verify', async () => {
    const keyPair = await joseNew.generateKeyPair('ES256');

    const signer = new joseNew.CompactSign(payload)
      .setProtectedHeader({
        alg: 'ES256'
      });
    const jws = await signer.sign(keyPair.privateKey);
    const verified = await joseNew.compactVerify(jws, keyPair.publicKey);
    expect(Buffer.from(verified.payload).toString('hex')).toEqual(payload.toString('hex'));
  });
});
