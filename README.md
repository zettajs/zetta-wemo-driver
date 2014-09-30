# Zetta Driver for Belkin's Wemo

[Zetta](http://zettajs.io) device package for Belkin Wemo Driver, use this to discover Wemo sockets on your [Zetta](http://zettajs.io) platform. Uses the [node-wemo](https://github.com/hecomi/node-wemo) from Hecomi to communicate with the socket.

## Install

```
npm install zetta-wemo-driver
```

## Usage

```js
var zetta = require('zetta');
var Wemo = require('zetta-wemo-driver');

zetta()
  .use(Wemo)
  .listen(1337);

```

## License

MIT
