export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

function isObjectLike(value: unknown) {
  return typeof value === 'object' && value !== null
}

export function isObject<T = object>(input: unknown): input is T {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
    return false
  }
  if (Object.getPrototypeOf(input) === null) {
    return true
  }
  let proto = input
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(input) === proto
}

export function concat(...buffers: Uint8Array[]): Uint8Array {
  const size = buffers.reduce((acc, { length }) => acc + length, 0)
  const buf = new Uint8Array(size)
  let i = 0
  buffers.forEach((buffer) => {
    buf.set(buffer, i)
    i += buffer.length
  })
  return buf
}

export function base64ToUrlSafe(input: string): string {
  return input
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function base64FromUrlSafe(input: string): string {
  let output = input
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  let pad = output.length % 4;
  if (pad > 0) {
    pad = 4 - pad;
    output += '='.repeat(pad);
  }
  return output;
}
