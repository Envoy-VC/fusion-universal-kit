// Define the expected structure of a single UTXO from the API response
interface Utxo {
  txid: string;
  vout: number;
  status: object;
  value: number; // The amount in satoshis
}

export const getBtcBalance = async (address: string): Promise<bigint> => {
  const apiUrl = `http://localhost:3000/address/${address}/utxo`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch UTXOs: ${errorText}`);
  }

  const utxos: Utxo[] = (await response.json()) as Utxo[];

  if (utxos.length === 0) {
    return 0n;
  }

  const totalBalance = utxos.reduce((sum, utxo) => sum + utxo.value, 0);
  return BigInt(totalBalance);
};
