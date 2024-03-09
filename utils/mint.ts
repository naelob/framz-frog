import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import contractAbi from "./contract.json";

const account = privateKeyToAccount(("" as `0x`) || "");

export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(process.env.ALCHEMY_URL),
});

const walletClient = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: http(process.env.ALCHEMY_URL),
});

export async function mintNft(toAddress: string) {
  try {
    const { request }: any = await publicClient.simulateContract({
      account,
      address: "0xDa827111946Aed7b5cFAC4F3Da2F1BDBBfd9903e",
      abi: contractAbi,
      functionName: "mintFor",
      args: [[toAddress as `0x`]],
    });
    const transaction = await walletClient.writeContract(request);

    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function balanceOf(address: string) {
  try {
    const balanceData = await publicClient.readContract({
      address: "0xDa827111946Aed7b5cFAC4F3Da2F1BDBBfd9903e",
      abi: contractAbi,
      functionName: "balanceOf",
      args: [address as `0x`],
    });
    const balance: number = Number(balanceData);
    return balance;
  } catch (error) {
    console.log(error);
    return error;
  }
}
