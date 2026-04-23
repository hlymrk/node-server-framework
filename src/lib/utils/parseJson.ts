const parseJson = (str: string) => {
  if (str) {
    return JSON.parse(str);
  }
  return {};
};

export { parseJson };
