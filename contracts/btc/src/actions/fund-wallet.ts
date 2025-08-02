export const fundWallet = async (
  address: string,
  amountInBtc: number,
): Promise<string> => {
  const apiUrl = "http://localhost:3000/faucet";

  const response = await fetch(apiUrl, {
    body: JSON.stringify({ address, amount: amountInBtc }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Faucet request failed: ${errorText}`);
  }

  const { txid } = (await response.json()) as { txid: string };
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return txid;
};
