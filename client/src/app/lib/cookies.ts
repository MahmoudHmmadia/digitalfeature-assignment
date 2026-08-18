export function setCookie(
  name: string,
  value: string,
  days = 7,
  path = '/',
): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  const secure = window.location.protocol === 'https:' ? ';Secure' : '';

  document.cookie =
    `${name}=${encodeURIComponent(value)};` +
    `expires=${date.toUTCString()};path=${path};SameSite=Strict${secure}`;
}

export function getCookie(name: string): string | null {
  const nameEq = `${name}=`;

  for (const rawCookie of document.cookie.split(';')) {
    const cookie = rawCookie.trim();

    if (cookie.startsWith(nameEq)) {
      return decodeURIComponent(cookie.substring(nameEq.length));
    }
  }

  return null;
}

export function deleteCookie(name: string, path = '/'): void {
  document.cookie = `${name}=; Max-Age=-99999999; path=${path}`;
}
