// Based on example: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey

function getKeyMaterial(password) {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"],
    );
}

async function getDerivedKey(keyMaterial, salt) {
    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"],
    );
}

export async function encrypt(data, salt, iv, password) {
    const keyMaterial = await getKeyMaterial(password);
    const key = await getDerivedKey(keyMaterial, salt)

    return window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        data,
    );
}

export async function decrypt(data, salt, iv, password) {
    const keyMaterial = await getKeyMaterial(password);
    const key = await getDerivedKey(keyMaterial, salt)

    return window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data,
    );
}