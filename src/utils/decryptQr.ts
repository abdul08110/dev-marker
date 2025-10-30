import forge from 'node-forge';
import { PRIVATE_KEY } from '../keys/privateKey';

export function decryptQrCode(encryptedBase64: string): string | null {
    const privateKey = forge.pki.privateKeyFromPem(PRIVATE_KEY);
    const encryptedBytes = forge.util.decode64(encryptedBase64);
    const decrypted = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');;
    return decrypted;
}
