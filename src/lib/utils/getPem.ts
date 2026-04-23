import { readFileSync } from "node:fs";

export const getPem = () => {
  try {
    const key = readFileSync("./https/key.pem"),
      cert = readFileSync("./https/cert.pem");
    return {
      key,
      cert,
    };
  } catch (e: any) {
    console.log(
      `${e.code}: Error Reading HTTP files: \n ${e.path}\n\n Continuing server regardles of https server options..\n`
    );
  }
};
