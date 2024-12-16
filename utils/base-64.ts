export function encryptToBase64URI(text: string): string {
  return encodeURI(btoa(text));
}

export function decryptFromBase64URI(text: string): string {
  return atob(decodeURI(text));
}
