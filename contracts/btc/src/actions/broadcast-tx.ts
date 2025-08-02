export const broadcastTransaction = async (txHex: string): Promise<string> => {
  const apiUrl = "http://localhost:18443";
  const credentials = Buffer.from("nigiri:nigiri").toString("base64");

  console.log("📡 Broadcasting transaction to local Nigiri node:", apiUrl);

  // Construct the JSON-RPC request payload
  const requestBody = JSON.stringify({
    id: "broadcast",
    jsonrpc: "1.0",
    method: "sendrawtransaction",
    params: [txHex],
  });

  const response = await fetch(apiUrl, {
    body: requestBody,
    headers: {
      // biome-ignore lint/style/useNamingConvention: safe
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const responseData = (await response.json()) as
    | { result: string }
    | { error: string };

  // Check for an error in the JSON-RPC response
  if ("error" in responseData) {
    throw new Error(`Broadcast failed: ${JSON.stringify(responseData.error)}`);
  }

  const txid = responseData.result;
  return txid;
};
