import CryptoJS from "crypto-js";
import {aesKey} from "./httpConfig";


export const decryptMessage = message => {
  const bytes = CryptoJS.AES.decrypt(message, aesKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}