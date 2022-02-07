class PingSigner {
  constructor(chainName) {
    this.chainName = chainName;
  }
  async getChains() {
    return this.request("getChains");
  }

  async getAccounts() {
    return this.request("getAccounts", this.chainName);
  }

  async sign(address, signDoc) {
    return this.signAmino(address, signDoc);
  }

  async signDirect(address, signDoc) {
    return this.request("signDirect", [address, signDoc]);
  }

  async signAmino(address, signDoc) {
    return this.request("signAmino", [address, signDoc]);
  }

  async request(method, args = null) {
    return new Promise((resolve, reject) => {
      const responseCall = (e) => {
        // this.eventListener.removeMessageListener(responseCall);
        const result = e.data;

        if (result.type !== "ping-response") {
          return;
        }

        window.removeEventListener("message", responseCall);

        if (!result) {
          reject(new Error("Result is null"));
          return;
        }

        if (result.error) {
          reject(new Error(result.error));
          return;
        }

        resolve(result);
      };

      window.addEventListener("message", responseCall);
      window.postMessage(
        {
          type: `ping-wallet-${method}`,
          args,
        },
        "*"
      );
    });
  }
}

window.PingSigner = new PingSigner();
window.PingSigner.getChains().then((data) => {
  console.log("request done:", data);
});
setTimeout(() => {
  window.PingSigner.request("opq", "text from webpage.").then((data) => {
    console.log("request done:", data);
  });
}, 3000);

console.log("injected is invorked.");
