import { readFileSync } from "node:fs";
import { resolve, isAbsolute } from "node:path";

const getPath = (envVar: string | undefined, fallback: string) => {
  const filePath = envVar || fallback;
  return isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
};

export const getPem = () => {
  try {
    const keyPath = getPath(
      process.env.HTTPS_KEY_PATH || process.env.KEY_PATH,
      "./https/key.pem",
    );
    const certPath = getPath(
      process.env.HTTPS_CERT_PATH || process.env.CERT_PATH,
      "./https/cert.pem",
    );

    const key = readFileSync(keyPath);
    const cert = readFileSync(certPath);

    return {
      key,
      cert,
    };
  } catch (e: any) {
    console.log(
      `${e.code}: Error reading HTTPS files:\n ${e.path}\n\nContinuing server regardless of HTTPS server options...\n`,
    );
  }
};
