// Store the NFT image on nft.storage and return IPFS hash
import meta from "./grandPrixMeta";
import mime from "mime";
import path from "path";
import { NFTStorage } from "nft.storage";
import { MintInterface } from "../types";
import { getConfigName } from "@dfdao/procedural";

const API_KEY = import.meta.env.VITE_NFT_STORAGE_KEY;

export async function storeNFTMeta(
  image: Blob | File,
  inputs: MintInterface
): Promise<string> {
  // will change meta object itself bc pointer
  meta.attributes.map((a) => {
    if (a.trait_type == "Config Hash") {
      a.value = inputs.configHash;
    } else if (a.trait_type == "Grand Prix") {
      a.value = getConfigName(inputs.configHash);
    } else {
      return a;
    }
  });

  const nft = {
    image, // use image Blob as `image` field
    ...meta,
  };

  if (!API_KEY) throw new Error("no NFT STORAGE key found");
  const client = new NFTStorage({ token: API_KEY });
  console.log(`nft`, nft);
  const metadata = await client.store(nft);
  console.log("NFT data stored!");
  console.log("Metadata URI: ", metadata.url);
  return metadata.url;
}
