export function avatarPathChecker(path: string | null) {
  if (path === null) return undefined;
  const isDomainPath = /^\/http/.test(path);
  if (isDomainPath) return path.slice(1);
  else return "https://image.tmdb.org/t/p/w92" + path;
}
