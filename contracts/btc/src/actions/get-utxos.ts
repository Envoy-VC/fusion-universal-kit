interface BitcoinUTXO {
  txid: string;
  vout: number;
  value: number;
  scriptPubKey: string;
  address: string;
}

export const getUTXOs = async (address: string): Promise<BitcoinUTXO[]> => {
  const apiUrl = `http://localhost:5000/address/${address}/utxo`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No UTXOs found for address");
  }

  // biome-ignore lint/suspicious/noExplicitAny: safe
  const utxos: BitcoinUTXO[] = data.map((utxo: any) => ({
    address: address,
    scriptPubKey: "",
    txid: utxo.txid,
    value: utxo.value,
    vout: utxo.vout,
  }));

  return utxos;
};
