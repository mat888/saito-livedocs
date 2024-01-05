class Livedocs_Ui {
        constructor(app, mod, container="") {
                this.app = app;
                this.mod = mod;
        }
        attachEvents() {
                const tx_button = document.getElementById("sendTx_button");
                tx_button.onclick = (e) => {
                        console.log("sendButton clicked");
			let recipient = document.getElementById("txRecipient").value;
			let msg_data  = document.getElementById("txMsg").value;
                        this.mod.sendTx(String(recipient), String(msg_data));
                }
		const relay_button = document.getElementById("sendRelay_button");
		relay_button.onclick = (e) => {
			console.log("reqButton clicked");
			let recipient = document.getElementById("relayRecipient").value;
			console.log(recipient);
			let msg = document.getElementById("relayMessage").value;
			this.mod.sendRelayMessage(recipient, data=msg);
		}
		const keyExchange_button = document.getElementById("keyExchange_button");
		keyExchange_button.onclick = (e) => {
			let pubKey = document.getElementById("exchangePubKey").value;
			this.mod.keyExchange(pubKey);
		}
		const encMsg_button = document.getElementById("encMsg_button");
		encMsg_button.onclick = (e) => {
			let pubKey = document.getElementById("encPubKey").value;
			let msg    = document.getElementById("encMsg").value
			this.mod.encryptedMessage(pubKey, msg);
		}
		/*
		const encDataButton = document.getElementById("encData_button");
		encDataButton.onclick = (e) => {
			let pubKey = document.getElementById("encPeerPubKey").value;
			this.mod.encryptedPeerMessage(pubKey);
		}
		*/

        }
	insertDOM(div, str) {
		document.getElementById(div).innerHTML = str;
	}

}

module.exports = Livedocs_Ui;

