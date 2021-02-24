const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");

const userBroker = new ServiceBroker({
	namespace: "dev",
  nodeID: "user-node",
  transporter: "NATS"
});

userBroker.createService({
  name: "users",
  mixins: [DbService],

  settings: {
    fields: ["_id", "name", "email", "address"],
		entityValidator: {
			name: "string"
		}
   },

  actions: {
    listUsers: {
    	async handler(ctx) {
    		try{
					const response = await this.broker.call("users.find", {});;
					const log = await this.broker.call("logger.createLog", {action: "list user"});
					return response;
				} catch (err){
					return err;
				}
    	}
    },
    createUser: {
    	async handler(ctx) {
				try{
					const response = await this.broker.call("users.create", ctx.params);
					const log = await this.broker.call("logger.createLog", {action: "create user"});
					return response;
				} catch (err){
					return err;
				}
    	}
    }
  },
});

Promise.all([userBroker.start()]).then(() => {
  userBroker.repl();
});