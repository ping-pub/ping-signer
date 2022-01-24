let sessionkey = "";

chrome.runtime.onMessage.addListener((msg, _, responseCall) => {
  console.log(msg);
  switch (msg.event) {
    case "GetSessionKey":
      responseCall(sessionkey);
      break;
    case "SetSessionKey":
      sessionkey = msg.input;
      responseCall();
      break;
    default:
      console.log("no handler");
      responseCall();
  }
});
