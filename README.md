# jose-browser

[jose](https://www.npmjs.com/package/jose) does not support EdDSA in browser.
Override implementation of EdDSA using [@noble/ed25519](https://www.npmjs.com/package/@noble/ed25519) for browser support.

Don't worry if the jose version goes up! We don't use jose as a dependency.
Override the existing jose with extendJose .

## Installation

**NPM**

```bash
npm install --save jose-browser jose
```

**YARN**

```bash
yarn add jose-browser jose
```

## Usage

```typescript
import * as joseOriginal from 'jose';
const jose = src.extendJose(joseOriginal);

// joseNew.importJWK
// joseNew.CompactSign
// joseNew.compactVerify
// ...

```

## License

Apache-2.0
