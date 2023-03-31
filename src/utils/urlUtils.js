const URL_REGEX = /^\w+:\/\/([^/]+\.\w+)/;

export function isValidURL(string) {
  // new URL does not throw on React Native for invalid URLs
  return URL_REGEX.test(string);
}
