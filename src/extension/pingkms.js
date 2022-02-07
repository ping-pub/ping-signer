export default class PingSigner {
  async request(method, args) {
    return new Promise((resolve, reject) => {
      const responseCall = (e) => {
        this.eventListener.removeMessageListener(responseCall);

        const result = e.data;

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
