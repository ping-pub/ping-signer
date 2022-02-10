class PingSigner {
  async getChains() {
    return this.request("getChains");
  }

  async enable(chainName) {
    this.chainName = chainName;
  }

  async getAccounts() {
    return this.request("getAccounts", [this.chainName]);
  }

  async sign(address, signDoc) {
    return this.signAmino(address, signDoc);
  }

  async signDirect(address, signDoc) {
    return this.request("signDirect", { address, signDoc });
  }

  async signAmino(address, signDoc) {
    return this.request("signAmino", { address, signDoc });
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

        resolve(result.body);
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
window.PingSigner.enable("akash-network");
window.PingSigner.getAccounts().then((data) => {
  console.log("request done:", data);
});
setTimeout(() => {
  window.PingSigner.signAmino("akash1lp9rqcezrmtp0h75s464h6urn7jgj64heang8l", {
    a: "a",
    b: "b",
  }).then((data) => {
    console.log("request done:", data);
  });
}, 1000);

console.log("injected is invorked.");
