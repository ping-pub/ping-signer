const store_type = "store";
const CryptoJS = require("crypto-js");

export function aesEncrypt(txt, password) {
  return CryptoJS.AES.encrypt(txt, password).toString();
}

export function aesDecrypt(text, password) {
  // Decrypt
  var bytes = CryptoJS.AES.decrypt(text, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function readDecryptPassword() {
  return readStore("password");
}

export async function readPassword(password) {
  return readStore("password").then((x) => aesDecrypt(x, password));
}

export async function removeAccounts() {
  return removeStore("password").then(() => console.log("removed"));
}

export async function savePassword(value, password) {
  return writeStore({ password: aesEncrypt(value, password) });
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
    console.log("removing")
    chrome.storage.local.remove([key], resolve);
  });
}

export async function readStore(key) {
  const result = new Promise(function (resolve) {
    chrome.storage.local.get([key], (data) => resolve(data));
  });
  return result.then((x) => x[key]);
}
