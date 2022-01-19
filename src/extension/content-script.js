document.addEventListener("DOMContentLoaded", function () {
  console.log("我被执行了！");
  const scriptElement = document.createElement("script");
  scriptElement.src = chrome.runtime.getURL("injected.js");
  scriptElement.type = "text/javascript";

  const container = document.head || document.documentElement;
  container.appendChild(scriptElement);
  console.log("injected done");
  // scriptElement.remove();
});
