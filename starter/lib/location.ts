export const parseLocation = (input: string) => {
  const clean = input.replace('rack:', '').trim();
  const parts = clean.split('/');
  if (parts.length >= 5) {
    return { site: parts[0], room: parts[1], row: parts[2], rack: parts[3], ru: parts[4] };
  }
  return null;
};
