// fheClient.js
// Lightweight wrapper showing how to call @fhevm/sdk to create ciphertexts.
// NOTE: This code uses the SDK API shape illustratively. Replace with the actual SDK usage.
import { FHE } from '@fhevm/sdk';
import { BytesLike } from 'ethers';

// Create an encrypted zero ciphertext for an option (used during initialize)
export async function createZeroCiphertext() {
  // SDK: FHE.createCiphertext(0) or FHE.encrypt(0) etc.
  const c = await FHE.encrypt(0);
  // normalize to raw bytes (some SDKs return object with .toBytes or base64)
  return c;
}

// Encrypt a single-vote (one-hot: 1 for chosen option)
export async function createEncryptedVote() {
  const c = await FHE.encrypt(1);
  return c;
}

// Convert SDK ciphertext to bytes suitable for contract input (placeholder)
export function toBytes(cipher) {
  // SDK may return Uint8Array or base64 string. If object, call .toBytes()
  if (cipher instanceof Uint8Array) return cipher;
  if (typeof cipher === 'string') {
    // base64 string -> Uint8Array
    return Uint8Array.from(atob(cipher), c=>c.charCodeAt(0));
  }
  if (cipher && cipher.toBytes) return cipher.toBytes();
  throw new Error('Unsupported ciphertext format');
}
