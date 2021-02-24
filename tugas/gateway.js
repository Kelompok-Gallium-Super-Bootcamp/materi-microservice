const { ServiceBroker } = require("moleculer");
const HTTPServer = require("moleculer-web");

const gatewayBroker = new ServiceBroker({
  namespace: "dev",
  nodeID: "gateway-node",
  transporter: "NATS"
});

gatewayBroker.createService({
  name: "gateway",
  mixins: [HTTPServer],

  settings: {
    port: process.env.PORT || 9111,
    ip: "0.0.0.0",
    use: [],
    routes: [
      {
        path: "/api",
        aliases: {
          "GET logs": "logger.listLogs",
          "POST log": "logger.createLog",
					"GET users": "users.listUsers",
          "POST user": "users.createUser",
					"GET transactions": "transactions.listTransactions",
          "POST transaction": "transactions.createTransaction"
        }
      }
    ]
  },
});

// Start brokers
Promise.all([gatewayBroker.start()]).then(() => {
  gatewayBroker.repl();
});