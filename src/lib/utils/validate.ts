export const validate = (
  input: any,
  type: string | any,
  fallback: any,
  truthy?: boolean,
  cb?: (input: any) => void,
) => {
  let condition;

  if (type === "array") {
    condition = typeof input === "object" && Array.isArray(input);
    return condition ? cb!(input) : fallback;
  }

  if (!truthy) {
    condition = typeof input !== type;
    // avow(condition);
    return condition ? cb!(input) : fallback;
  }
  condition = typeof input === type;
  // avow(condition);
  return condition ? cb!(input) : fallback;
};
