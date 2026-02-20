import crypto from 'crypto';

const DivhuntCrypto =
{
    Encrypt(data, key)
    {
        const buffer = Buffer.from(key, 'hex');
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', buffer, iv);

        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
        encrypted += cipher.final('base64');

        const tag = cipher.getAuthTag();

        return iv.toString('base64') + ':' + encrypted + ':' + tag.toString('base64');
    },

    Decrypt(ciphertext, key)
    {
        const buffer = Buffer.from(key, 'hex');
        const [ivB64, encryptedB64, tagB64] = ciphertext.split(':');

        const iv = Buffer.from(ivB64, 'base64');
        const encrypted = Buffer.from(encryptedB64, 'base64');
        const tag = Buffer.from(tagB64, 'base64');

        const decipher = crypto.createDecipheriv('aes-256-gcm', buffer, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encrypted, null, 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    }
};

export default DivhuntCrypto;
