export const broadcastTransaction = async (txHex: string): Promise<string> => {
  // Change the URL to the Chopsticks proxy endpoint for broadcasting
  const apiUrl = "http://localhost:3000/tx";

  const response = await fetch(apiUrl, {
    // The body is just the raw transaction hex
    body: txHex,
    headers: {
      "Content-Type": "text/plain",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Broadcast failed: ${errorText}`);
  }

  // The response body is the transaction ID
  const txid = await response.text();
  console.log("✅ Transaction broadcasted successfully! TXID:", txid);
  return txid;
};
