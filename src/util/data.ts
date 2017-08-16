const sentCache: object = {};

function getSent(email: string): string {
  /*if (!sentCache.hasOwnProperty(email)) {
    sentCache[email] = [];
  }

  const result: string = sentCache[email];

  return result; */
  return "";
}

export { 
  getSent
}