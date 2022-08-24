const Environment = require('jest-environment-jsdom');
import * as webcrypto from '@peculiar/webcrypto';

/**
 * A custom environment to set the TextEncoder that is required by TensorFlow.js.
 */
class CustomTestEnvironment extends Environment {
  setup() {
    const crypto = new webcrypto.Crypto();
    return super.setup()
      .then(() => {
        if (typeof this.global.TextEncoder === 'undefined') {
          const { TextEncoder, TextDecoder } = require('util');
          Object.assign(this.global, {
            TextEncoder: TextEncoder,
            TextDecoder: TextDecoder,
            crypto: crypto, // require('@peculiar/webcrypto')
            CryptoKey: webcrypto.CryptoKey,
            Uint8Array: Uint8Array
          });
        }
      });
  }
}

module.exports = CustomTestEnvironment;
