## Saito Livedocs

Livedocs is an Interactive Saito Documentation module. Livedocs demonstrates in real time what the Saito Lite Rust Node is capable via a real time, interactive interface which both displays the relevant code while running it. The purpose of this module is not just to showcase the Saito Blockchain's most fundamental user-facing functions in real time, but to also serve as a template for builders who want quick access to a basic, working application.

### Saito Lite Rust Node

Livedocs is a module of and thus requires a ["Saito Lite Rust" (SLR) Node](https://github.com/SaitoTech/saito-lite-rust) in order to run.

Information for installing the node software can be found in the previous Github link's README, but the recommended instructions are on [the wiki](https://wiki.saito.io/tech/installation/javascript).

### Custom Module Setup

Once the SLR Node is installed and can run without error, the livedocs module is installed by placing this entire repo into a new folder within the `mods/` folder of your SLR Node. Setting up the livedocs module can be done via the following commands:

`cd mods/`

`git clone https://github.com/mat888/saito-livedocs.git` (this repository)

`mv saito-livedocs livedocs` (rename to simply 'livedocs' for simplicity in next steps)

### Setting up the config files:

If the file `config/modules.config.js` does not exist in your SLR node, create it by copying the default config.

`cp config/modules.default.js config/modules.config.js`

Open `config/modules.config.js` in a text editor and add the line `'livedocs/livedocs.js',` to **both** the `core` and `lite` arrays - which should end up looking something like this but without the `...` (do not copy and paste, just add the `livedocs/livedocs.js` line):
```
module.exports = {
	core: [
		'livedocs/livedocs.js',
		'arcade/arcade.js',
		'archive/archive.js',
		'blackjack/blackjack.js',
		...
	],
	lite: [
		'livedocs/livedocs.js',
		'arcade/arcade.js',
		'archive/archive.js',
		'blackjack/blackjack.js',
    ...
	]
}
```

### Recompile

Just as during the first install of the SLR Node, changes to the modules requires compilation.

For a full reset of the blockchain and a lengthier compile (recommended for desperate or thorough debugging), use:

`npm run nuke` (your config and module files will not be altered)

For a quick recompile, suitable for testing out small changes and preserving your local chain, use:

`npm run compile dev`

If the installation went smoothly, this step should produce no errors. Use the following command from the root of your Saito Lite Rust directory:

`npm start`

and wait for the node to finish initialization (a text-art cube and URL will appear when ready)l

After all that, the livedocs module should be accessible at:

`http://localhost:12101/livedocs/`

### Community

If you run into any issues, contact the community for assistance. The core team is most likely to assist you if contacted through a [Saito.io] domain:

https://saito.io/redsquare

https://saito.io/chat

https://t.me/SaitoNodeRunners

https://t.me/SaitoIO
