import {
  JoseType
} from './types';
import {
  importJWK,
  exportJWK
} from './extended/jwk';
import {
  flattenedVerify, makeFlattenedSign
} from './extended/flattened';
import {
  compactVerify, makeCompactSign
} from './extended/compact';

export function extendJose(input?: JoseType): JoseType {
  const joseImplementation = input || require('jose');
  const newJose: JoseType = Object.assign({}, joseImplementation);

  newJose.importJWK = importJWK.bind(this, joseImplementation, newJose);
  newJose.exportJWK = exportJWK.bind(this, joseImplementation, newJose);
  newJose.flattenedVerify = flattenedVerify.bind(null, joseImplementation, newJose);
  newJose.compactVerify = compactVerify.bind(null, joseImplementation, newJose);
  newJose.FlattenedSign = makeFlattenedSign(joseImplementation, newJose);
  newJose.CompactSign = makeCompactSign(joseImplementation, newJose);

  return newJose;
}
