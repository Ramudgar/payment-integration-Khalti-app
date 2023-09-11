
var config = {
  // replace the publicKey with yours
  "publicKey": 'use your public key here',

//   "publicKey": '<%= khaltiPublicKey %>',
  productIdentity: "12345",
  productName: "Dragon",
  productUrl: "http://gameofthrones.wikia.com/wiki/Dragons",
  paymentPreference: [
    "KHALTI",
    "EBANKING",
    "MOBILE_BANKING",
    "CONNECT_IPS",
    "SCT",
  ],
  eventHandler: {
    onSuccess(payload) {
      // hit merchant api for initiating verfication
      console.log(payload);
      alert("Payment successful");
      console.log("Payment successful");
    },
    onError(error) {
      console.log(error);

      alert("Payment unsuccessful");
      console.log("Payment unsuccessful");
    },
    onClose() {
      console.log("widget is closing");
      // generate another message
      alert("Payment cancelled");
      console.log("Payment cancelled");
    },
  },
};

var checkout = new KhaltiCheckout(config);
var btn = document.getElementById("payment-button");
btn.onclick = function () {
  // minimum transaction amount must be 10, i.e 1000 in paisa.
  checkout.show({ amount: 1000 });
};
