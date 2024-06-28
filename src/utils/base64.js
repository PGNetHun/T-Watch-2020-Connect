
export const encodeArrayBuffer = (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export const decodeArrayBuffer = (base64) => {
    return atob(base64);
}