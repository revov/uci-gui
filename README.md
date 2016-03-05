#uci-gui
## Web based platform for chess analysis ##

This project is created as part of the Software Technologies course at Plovdiv University. The idea is to provide a web based platform for chess game analysis with UCI engines.

### Targeted technologies: ###

#### Front end ####
- [Angular 2](https://angular.io/) with [JSPM](http://jspm.io/) and [plugin-typescript](https://github.com/frankwallis/plugin-typescript)
- [Chess js](https://github.com/jhlywa/chess.js)
- [Chessboard.js](http://chessboardjs.com)
- [Semantic UI](http://semantic-ui.com/)
- [Plotly js](https://plot.ly/javascript/)
- [Socket IO](http://socket.io/)

#### Back-end ####
- [Node JS](https://nodejs.org) with [Express](http://expressjs.com/)
- [Mongo db](https://www.mongodb.org/)
- [Passport JS](http://passportjs.org/) for authentication
- [Socket IO](http://socket.io/)
- [NPM uci](https://www.npmjs.com/package/uci)
- [Stockfish chess engine](https://stockfishchess.org/)
- [Rabbit MQ](https://www.rabbitmq.com/) for distributing the analysis [not yet decided]

Also check the [UCI Protocol Specification](http://download.shredderchess.com/div/uci.zip)

### Installation: ###
Prerequisites:
- Node JS installed
- Mongo DB installed
```
npm install
node_modules/.bin/jspm install
```
### Configure UCI engine: ###
Copy `config/engine.js.sample` to `config/engine.js` and specify the **full** path to your UCI engine executable of choice.

### Run: ###
```
npm start
```