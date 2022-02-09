/* eslint-disable no-undef */
let sessionkey = "";

// var port = chrome.runtime.connect({ name: "knockknock" });
// port.onMessage.addListener(function (msg) {
//   console.log("port msg in background:", msg);
//   if (msg.question === "Who's there?") port.postMessage({ answer: "Madame" });
//   else if (msg.question === "Madame who?")
//     port.postMessage({ answer: "Madame... Bovary" });
// });
// port.postMessage({ joke: "Knock knock" });

chrome.runtime.onMessage.addListener((msg, _, responseCall) => {
  console.log("background:", msg);
  switch (msg.event) {
    case "GetSessionKey":
      responseCall(sessionkey);
      break;
    case "SetSessionKey":
      sessionkey = msg.input;
      responseCall();
      break;
    case "signAmino": {
      openWindow(msg.input);
      responseCall();
      break;
    }
    case "approve": {
      sendMessageToContent(msg);
      responseCall();
      break;
    }
    case "reject": {
      sendMessageToContent(msg);
      responseCall();
      break;
    }
    default: {
      sendMessageToContent(msg);
      console.log("no handler");
      responseCall();
    }
  }
});

function openWindow() {
  chrome.windows.create(
    {
      //focus: true,
      width: 400,
      height: 600,
      url: chrome.runtime.getURL(`index.html#sign`),
      type: "popup",
    },
    (win) => {
      console.log(win);
      onRemoved.addListener((a) => {
        sendMessageToContent({ msg: "hello remove", a });
      });
    }
  );
}

function sendMessageToContent(msg) {
  chrome.tabs.query({ active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
      console.log(response);
    });
  });
}
