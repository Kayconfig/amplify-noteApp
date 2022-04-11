export function formatUsername(username) {
  return username.length > 13 ? username.slice(0, 10) + '...' : username;
}
