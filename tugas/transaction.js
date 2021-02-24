const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");

const trBroker = new ServiceBroker({
	namespace: "dev",
  nodeID: "tr-node",
  transporter: "NATS"
});

trBroker.createService({
  name: "transactions",
  mixins: [DbService],

  settings: {
    fields: ["_id", "to", "from", "value", "senderId", "receiverId"],
   },

  actions: {
    listTransactions: {
    	async handler(ctx) {
    		try{
					const response = await this.broker.call("transactions.find", {});;
					const log = await this.broker.call("logger.createLog", {action: "list transaction"});
					return response;
				} catch (err){
					return err;
				}
    	}
    },
    createTransaction: {
    	async handler(ctx) {
				try{
          const sender = await this.broker.call("users.find", {query :{"name" : ctx.params.from }})
          const receiver = await this.broker.call("users.find",{query :{"name" : ctx.params.to }})  
          ctx.params.senderId =   sender[0]._id      
          ctx.params.receiverId = receiver[0]._id
					const response = await this.broker.call("transactions.create", ctx.params);
					const log = await this.broker.call("logger.createLog", {action: "create transaction"});
					return response;
				} catch (err){
					return err;
				}
    	}
    }
  },
});

Promise.all([trBroker.start()]).then(() => {
  trBroker.repl();
});