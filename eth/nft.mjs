import { NFTStorage, File, Blob } from 'nft.storage'
import fs from 'fs'
import mime from 'mime'
import path from 'path'
import 'dotenv/config';
import meta from './metadata/grand_prix.js';

// read the API key from an environment variable. You'll need to set this before running the example!
const API_KEY = process.env.NFT_STORAGE_KEY

async function fileFromPath(filePath) {
  const content = await fs.promises.readFile(filePath)
  const type = mime.getType(filePath)
  return new File([content], path.basename(filePath), { type })
}


async function storeExampleNFT() {
  const args = process.argv.slice(2)

  if (args.length !== 1) {
    console.error(`usage: ${process.argv[0]} ${process.argv[1]} <image-path>`)
    process.exit(1)
  }
  const [imagePath] = args

  const image = await fileFromPath(imagePath)
  const nft = {
    image, // use image Blob as `image` field
    ...meta
  }
  console.log(image instanceof Blob);

  if(!API_KEY) throw new Error("no NFT STORAGE key found");
  const client = new NFTStorage({ token: API_KEY })
  console.log(`nft`, nft);
  const metadata = await client.store(nft)
  console.log('NFT data stored!')
  console.log('Metadata URI: ', metadata.url)
}

storeExampleNFT()
.catch(err => {
    console.error(err)
    process.exit(1)
})

