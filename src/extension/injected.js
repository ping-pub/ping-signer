class PingSigner {
  async getChains() {
    return this.request("getChains");
  }

  async enable(chainName) {
    this.chainName = chainName;
  }

  async getAccounts() {
    return this.request("getAccounts", [this.chainName]).then((accounts) =>
      accounts.map((i) => {
        i.pubkey = this.hexToBytes(i.pubkey);
        return i;
      })
    );
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

  hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
}

window.PingSigner = new PingSigner();
