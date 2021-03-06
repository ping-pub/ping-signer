/* eslint-disable no-undef */
import { stringToPath } from "@cosmjs/crypto";
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { toHex } from "@cosmjs/encoding";

const store_type = "page"; // store or page
const CryptoJS = require("crypto-js");

export function aesEncrypt(txt, password) {
  return CryptoJS.AES.encrypt(txt, password).toString();
}

export function aesDecrypt(text, password) {
  // Decrypt
  var bytes = CryptoJS.AES.decrypt(text, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function readSignInput() {
  return readStore("input");
}

export async function readDecryptPassword() {
  return readStore("password");
}

export async function readPassword(password) {
  return readStore("password").then((x) => aesDecrypt(x, password));
}

export async function savePassword(value, password) {
  return writeStore({ password: aesEncrypt(value, password) });
}

export async function readCurrent() {
  return readStore("current");
}

export async function writeCurrent(value) {
  return writeStore({ current: value });
}

export async function readAccounts() {
  return readStore("accounts");
}

export async function writeAccounts(value) {
  return writeStore({ accounts: value });
}

export async function removeAccounts() {
  removeStore("password");
  removeStore("accounts");
}

export async function getSessionKey() {
  if (store_type === "store") {
    return readStore("sessionkey");
  }
  return await internRequest("GetSessionKey");
}

export async function setSessionKey(value) {
  if (store_type === "store") {
    return writeStore({ sessionkey: value });
  }
  return await internRequest("SetSessionKey", value);
}

export async function internRequest(event, input = null) {
  return new Promise(function (resolve) {
    const msg = { event, input };
    chrome.runtime.sendMessage(msg, resolve);
  });
}
export async function writeStore(data) {
  return new Promise(function (resolve) {
    chrome.storage.local.set(data, resolve);
  });
}

export async function removeStore(key) {
  return new Promise(function (resolve) {
    chrome.storage.local.remove([key], resolve);
  });
}

export async function readStore(key) {
  const result = new Promise(function (resolve) {
    chrome.storage.local.get([key], (data) => resolve(data));
  });
  return result.then((x) => x[key]);
}

export async function createAccounts(mnemonic, hdpath, prefix, name) {
  const options = {
    bip39Password: null,
    hdPaths: [stringToPath(hdpath)],
    prefix,
  };
  return await (await Secp256k1HdWallet.fromMnemonic(mnemonic, options))
    .getAccounts()
    .then((x) =>
      x.map((v) => {
        v.pubkey = toHex(v.pubkey);
        v.name = name;
        return v;
      })
    );
}

export async function signAmino(signerAddress, signDoc, password = "") {
  return readAccounts().then((accounts) => {
    if (!accounts) throw new Error("No Account found");
    const acc = Object.values(accounts).find(
      (acc) =>
        acc.addresses.findIndex((i) => i.address === signerAddress) !== -1
    );

    if (!acc) throw new Error("No Account found");
    const mnemonic = aesDecrypt(acc.mnemonic, password);
    const options = {
      bip39Password: null,
      hdPaths: [stringToPath(acc.hdpath)],
      prefix: signerAddress.substring(0, signerAddress.indexOf("1")),
    };
    return Secp256k1HdWallet.fromMnemonic(mnemonic, options).then((wallet) => {
      return wallet.signAmino(signerAddress, signDoc);
    });
  });
}
