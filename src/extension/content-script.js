/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  response(request);
  sendResponse("message forwarded");
});

document.addEventListener("DOMContentLoaded", function () {
  // console.log("我被执行了！");
  const scriptElement = document.createElement("script");
  scriptElement.src = chrome.runtime.getURL("injected.js");
  scriptElement.type = "text/javascript";

  const container = document.head || document.documentElement;
  container.appendChild(scriptElement);
  // console.log("injected done");
  scriptElement.remove();
});

window.addEventListener(
  "message",
  (event) => {
    if (event.data.target) return;
    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }

    if (event.data.type && event.data.type.startsWith("ping-wallet")) {
      switch (event.data.type) {
        case "ping-wallet-getChains":
          getchains();
          break;
        case "ping-wallet-getAccounts":
          getAccounts(event.data.args[0]);
          break;
        case "ping-wallet-signDirect":
          signDirect(event.data.args);
          break;
        case "ping-wallet-signAmino":
          signAmino(event.data.args);
          break;
      }
    }
  },
  false
);

async function readStore(key) {
  const result = new Promise(function (resolve) {
    chrome.storage.local.get([key], (data) => resolve(data));
  });
  return result.then((x) => x[key]);
}

async function writeStore(data) {
  return new Promise(function (resolve) {
    chrome.storage.local.set({ input: data }, resolve);
  });
}

function response(data) {
  window.postMessage(
    {
      type: "ping-response",
      body: data,
    },
    "*"
  );
}

function getchains() {
  readStore("accounts").then((data) => {
    if (data) {
      readStore("current").then((current) => {
        const selected = current || Object.keys(data)[0];
        const chains = [];
        const accounts = data[selected];
        if (accounts) {
          accounts.addresses.forEach((element) => {
            chains.push(element.name);
          });
        }
        response(chains);
      });
    } else {
      response([]);
    }
  });
}

function getAccounts(chainName) {
  readStore("accounts").then((data) => {
    if (data) {
      readStore("current").then((current) => {
        const selected = current || Object.keys(data)[0];
        const chains = [];
        const accounts = data[selected];
        if (accounts) {
          if (chainName) {
            accounts.addresses
              .filter((x) => x.name === chainName)
              .forEach((element) => {
                chains.push(element);
              });
          } else {
            accounts.addresses.forEach((element) => {
              chains.push(element);
            });
          }
        }
        response(chains);
      });
    } else {
      response([]);
    }
  });
}

function signDirect(input) {
  writeStore(input).then(() => {
    chrome.runtime.sendMessage({ event: "signDirect", input }, (ret) => {
      console.log("window callback:", ret);
    });
  });
}

//function signAmino({ address, signDoc }) {
function signAmino(input) {
  writeStore(input).then(() => {
    chrome.runtime.sendMessage({ event: "signAmino", input }, (ret) => {
      console.log("window callback:", ret);
    });
  });
}
