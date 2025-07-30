import { exec } from "child_process";

const fundWallet = () => {
  // get arguments
  const address = process.argv[2];

  // run in shell
  // nilgiri faucet <address>
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
