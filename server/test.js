import axios from "axios";
import dotenv from "dotenv";

import { ethers } from "ethers";
dotenv.config();
console.log(process.env.PRIVATE_KEY);

const provider = new ethers.providers.EtherscanProvider();
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log("signer: ", signer);
const message = `Adding new Grand Prix Round as ${process.env.PUBLIC_KEY}`;
const signature = await signer.signMessage(message);
// await axios
//   .get("http://localhost:3000/rounds", {
//     params: {
//       endTime: 1,
//     },
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   })
//   .then(function (res) {
//     console.log(res.data);
//   })
//   .catch(function (res) {
//     console.log(res);
//   });

await axios
  .post("http://localhost:3000/rounds", {
    message,
    signature,
    winner: "me",
    description: "adadsasdasdadsadasd",
    startTime: 10,
    endTime: 1,
    configHash: "0x00",
  })
  .then(function (res) {
    console.log(res.data);
  })
  .catch(function (res) {
    console.log(res);
  });

// await axios
//   .put("http://localhost:3000/rounds", {
//     params: {
//       id: 15555,
//       winner: "not me",
//     },
//   })
//   .then(function (res) {
//     console.log(res.data);
//   })
//   .catch(function (res) {
//     console.log(res);
//   });

// await axios
//   .delete("http://localhost:3000/rounds/15555", {
//     params: {
//       id: 15555,
//     },
//   })
//   .then(function (res) {
//     console.log(res.data);
//   })
//   .catch(function (res) {
//     console.log(res);
//   });
