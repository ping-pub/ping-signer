import { readAccounts } from "../libs/utils.js";

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
    // We only accept messages from ourselves
    if (event.source != window) {
      return;
    }

    if (event.data.type && event.data.type.startsWith("ping-wallet")) {
      console.log(`${event.data.type}'s Content received ${event.data.args}`);
      switch (event.data.type) {
        case "ping-wallet-getChains":
          getchains();
          break;
        case "ping-wallet-getAccounts":
          break;
      }
    }
  },
  false
);

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
  readAccounts().then((data) => {
    response(data);
  });
}
