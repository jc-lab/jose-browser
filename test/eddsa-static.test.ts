import * as joseOriginal from 'jose';
import * as src from '../src';

const sampleKey = {
  pub: {
    alg: 'EdDSA',
    crv: 'Ed25519',
    x: '3oQobkLKGzJ7Arl9fIezGhZf3oj2lGlsRvK6kUTvW2w',
    kty: 'OKP'
  },
  pri: {
    alg: 'EdDSA',
    crv: 'Ed25519',
    d: 'f72zg4jp2QTDQa4nH40pMgYvB58Kx40kOtzW2wOA8rE',
    x: '3oQobkLKGzJ7Arl9fIezGhZf3oj2lGlsRvK6kUTvW2w',
    kty: 'OKP'
  }
};

const joseNew = src.extendJose(joseOriginal);

const payload = Buffer.from('HELLO WORLD');

describe('eddsa-static', () => {
  it('sign-and-verify', async () => {
    const privateKey = await joseNew.importJWK(sampleKey.pri);
    const publicKey = await joseNew.importJWK(sampleKey.pub);

    const signer = new joseNew.CompactSign(payload)
      .setProtectedHeader({
        alg: 'EdDSA'
      });
    const jws = await signer.sign(privateKey);
    const verified = await joseNew.compactVerify(jws, publicKey);
    expect(Buffer.from(verified.payload).toString('hex')).toEqual(payload.toString('hex'));
  });

  it('verify-pre-signed', async () => {
    const jws = 'eyJhbGciOiJFZERTQSJ9.SEVMTE8gV09STEQ.Q2D06PtYb6gFJwokNPIzXRzr67j54eHsRruiz8xdJeCTzk9oLKmf9WQ1gTHB1ZI7qMQXZBbbyfi2QJmRfiimCA';
    const publicKey = await joseNew.importJWK(sampleKey.pub);
    const verified = await joseNew.compactVerify(jws, publicKey);
    expect(Buffer.from(verified.payload).toString('hex')).toEqual(payload.toString('hex'));
  })

  it('verify-pre-signed-with-invalid', async () => {
    const jws = 'eyJhbGciOiJFZERTQSJ9.SEVMTE8gV09STEQ.qUy1XY2mxdzrlsVmbN816e9MSoKGbr3hSptEriTjUEcgzcZsNr0P9k74HBpvVzlTOqSzHY_93vt0RjnrWrGqAA';
    const publicKey = await joseNew.importJWK(sampleKey.pub);

    await expect(async () => {
      await joseNew.compactVerify(jws, publicKey);
    }).rejects.toThrowError(joseOriginal.errors.JWSSignatureVerificationFailed);
  })
});
