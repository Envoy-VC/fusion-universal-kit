import { exec } from "node:child_process";

export const fundWallet = (address: string) => {
  exec(`nigiri faucet ${address}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
  });
};
