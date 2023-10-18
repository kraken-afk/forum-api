export function randomStr(howMany = 43): string {
  if (howMany < 0)
    throw new Error('length of number cannot be negative number');

  let result = '';
  const utf8 =
    '!@#$%^&*[]{}+=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~-._';

  for (let i = 1; i <= howMany; i++)
    result += utf8[Math.floor(Math.random() * utf8.length)];

  return result;
}
