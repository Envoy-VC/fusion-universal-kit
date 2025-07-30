import { exec } from "node:child_process";

const fundWallet = () => {
  const address = process.argv[2];
  console.log(`💰 Funding address ${address}...`);

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

  console.log(`✅ Funding address ${address} complete.`);
};

fundWallet();
