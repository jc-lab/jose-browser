import {
  JoseType
} from './types';
import {importJWK} from './extended/jwk';
import {
  flattenedVerify, makeFlattenedSign
} from './extended/flattened';
import {
  compactVerify, makeCompactSign
} from './extended/compact';

export function extendJose(input?: JoseType): JoseType {
  const joseImplementation = input || require('jose');
  const newJose: JoseType = Object.assign({}, joseImplementation);

  newJose.importJWK = importJWK.bind(this, newJose);
  newJose.flattenedVerify = flattenedVerify.bind(null, newJose);
  newJose.compactVerify = compactVerify.bind(null, newJose);
  newJose.FlattenedSign = makeFlattenedSign(newJose);
  newJose.CompactSign = makeCompactSign(newJose);

  return newJose;
}
