const ModTemplate = require('../../lib/templates/modtemplate');
const Livedocs_Ui = require('./lib/main');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
//const PeerService = require("saito-js/lib/peer_service").default;

class Livedocs extends ModTemplate {
	constructor(app) {
		super(app);
		this.app = app;
		this.name = "Livedocs";
		this.slug = 'livedocs';
		this.description = 'Saito Interactive Documentation';
		this.categories = 'Utilities Dev';

		this.livedocs_ui = new Livedocs_Ui(this.app, this, "");
	}

	async render() { // BUILT-IN FUNCTION
		if (!this.app.BROWSER) {
			return;
		}

		// disables default saito.css,
		// comment this block if want to include saito.css
		var sheets = document.styleSheets.length
		for(var i=0;i<sheets;i++){
		    let stylesheet = document.styleSheets[i];
		     if (stylesheet.href != null) {
		      document.styleSheets[i].disabled=true;
		     }
		}

		this.livedocs_ui.render();

		let userPubKey = this.publicKey;

		console.log("userPubKey: ", userPubKey);

		document.getElementById("publicKey").innerHTML  = userPubKey;
		document.getElementById("txRecipient").value    = userPubKey;
		document.getElementById("relayRecipient").value = userPubKey;
		document.getElementById("exchangePubKey").value = userPubKey;
		document.getElementById("encPubKey").value = userPubKey;
		this.saveLocally("test save locally");
	}

	async sendTx(publicKey, message="") {
		let newtx = await this.app.wallet.createUnsignedTransaction(publicKey);
		newtx.msg.data = message;
		newtx.msg.module = this.name; // this.name == "Livedocs"

		await newtx.sign();
		this.app.network.propagateTransaction(newtx);
	}

	async onConfirmation(blk, tx, conf) { // BUILT-IN FUNCTION

		console.log("On Confirmation -- tx is to: ", tx.to[0].publicKey);

		if (tx.to[0].publicKey == this.watched) {
			console.log("watched matches recipient");
		}

		// conf refers to the number of confirmations a transaction has
		// 0 confs occurs during the first block the transaction is included in

		// this function only continues if on the first confirmation
		if (conf > 0) { return; }

		if (this.app.BROWSER) {
			let txmsg = tx.returnMessage();
			let sender = tx.from[0].publicKey;

			this.livedocs_ui.insertDOM("onConf", JSON.stringify(txmsg));
			console.log("onConfirmation ----------------------------------------- ", tx, sender);
		}

//		this.app.connection.on("livedocs-mod-emit", () => {console.log("\n\n emitted \n\n") });
		let mod = this.app.modules.returnModule("Livedocs");
	}


	sendRelayMessage(publicKey, data="") {
		this.app.connection.emit("relay-send-message", {
			recipient: publicKey,
			request: "livedocs request",
			data: data
		});

	}

	async handlePeerTransaction(app, tx=null, peer, callback=null) { // BUILT-IN FUNCTION
		if (tx.returnMessage().request != "livedocs request") {
			return;
		}
		if (this.app.BROWSER) {
			let message = tx.returnMessage().data;

			// If message has encrypted flag, decrypt message.encMsg
			if (message.encrypted) {
				message = message.encMsg;

				let sender = tx.from[0].publicKey;
				let decrypted = this.app.keychain.decryptMessage(sender, message);

				message = decrypted;
			}
			this.livedocs_ui.insertDOM("handlePeer_output", message);
		}
	}

	keyExchange(publicKey) {
		let encrypt_mod = this.app.modules.returnModule("Encrypt");
		encrypt_mod.initiate_key_exchange(publicKey);
		console.log(this.app.keychain);
	}

	encryptedMessage(publicKey, message="test_enc_message") {
		let encrypted_data = this.app.keychain.encryptMessage(publicKey, message);
		// do not allow the function to continue if encryption fails
		if (encrypted_data == message) {
			console.log("encryption failed");
			return;
		}
		let encr_obj = {};
		console.log(this.app.keychain);
		encr_obj.encrypted = true;
		encr_obj.encMsg = encrypted_data;
		this.sendRelayMessage(publicKey, encr_obj);
	}

	saveLocally(data) {
		console.log("app options: ", this.app.name, this.app.options);
		console.log(this.app.storage);
		this.app.storage.saveOptions();
	}

	/*
	async handlePeerTransaction(app, tx=null, peer, callback=null) {
		console.log("HANDLE PEER TX _______________");
		console.log(tx.returnMessage().request);

		if (tx.returnMessage().request != "livedocs test req") {
			return;
		}
		console.log("handlePeerTransaction = = = = = = = = \n");
		console.log(tx.returnMessage());
		console.log("tx is from: ", tx.from[0].publicKey);
		console.log("tx is to  : ", tx.to[0].publicKey);
		let recipient = tx.to[0].publicKey;

		let p = await this.app.network.getPeers();
		console.log("peers; ");
		let pks = [];
		for (let i = 0; i < p.length; i++) {
			console.log(p[i].publicKey);
			console.log(p[i].peerIndex);
			pks.push(p[i].publicKey);
		}

		if (this.app.BROWSER == false) {
			//console.log(peer.publicKey);
			// this needs a peer index, so presumably there is a global peer list it uses
			await this.app.network.sendRequestAsTransaction("msg2peer", "data2peer", null, p[0].peerIndex);
			console.log("sending from this client");

//	await this.app.network.sendRequest("network sending request", pks, null, p[0].peerIndex);
		}
		console.log(" = = = = = = = = = = = = = = = = = = = ");
	}
	async encryptedMessage(publicKey, message="test_enc_message") {
		let newtx = await this.app.wallet.createUnsignedTransaction(publicKey);
		newtx.msg.data = message;
		newtx.msg.module = this.name;
		newtx.msg.request = "enc_msg";

		newtx = await this.app.wallet.signAndEncryptTransaction(newtx, publicKey);
		this.app.network.propagateTransaction(newtx);
	}

*/
}

module.exports = Livedocs;
