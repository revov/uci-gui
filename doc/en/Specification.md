## Specification ##

### Purpose ###
The purpose of this project is to provide a web based platform for chess analysis that can serve as a GUI for UCI engines.

Since chess analysis is computationally expensive there is a lack of web based GUIs. Nowadays the migration from desktop software to cross-platform web applications is ubiquitous. We see more and more complex applications such as word processors, image editors, virtualization clients moving to the Web and we think that there is place for a web UCI GUI too.

### Terminology ###
- **Chess engine** - A computer program that can evaluate chess games. Often distributed as an executable.
- **UCI** - [Universal Chess Interface](https://en.wikipedia.org/wiki/Universal_Chess_Interface) is the most popular protocol for chess engines. It is text based and is utilized on the command line via the standard input/output. You can find the UCI spec [here](http://download.shredderchess.com/div/uci.zip).
- **PGN** - [Portable Game Notation](https://en.wikipedia.org/wiki/Portable_Game_Notation) is the standard text format for recording chess games (both moves and related metadata).
- **FEN** - [Forsyth–Edwards Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) is a standard notation for describing a particular board position of a chess game.
- **Ply** - A ply refers to one turn (also called *half turn*) taken by one of the players.
- **Position score** - In chess analysis a position can be scored with a number equivalent to the materialized advantage for one of the players measured in *centipawns*(1/100 of a pawn). The number is positive if white have the advantage or negative if black are in the lead. For example: if white are ahead with 2 pawns in equal other circumstances the position score should be around 200 (or often displayed simply as 2). If black are ahead with a bishop we may expect a score of roughly -350 (or simply -3.5). When chess engines score a position, they try to estimate the next moves of both sides and take into account not only the material advantage, but tactical opportunities, tempo and many other factors.
- **Depth** - Depth is an indicator of how many moves ahead the engine has taken into consideration while analyzing the current position. Measured in *plies*.

### Specification ###

#### Product ####
**Note:** Functionality is rapidly improving. The following specifications are just a list of what is already implemented:

##### Users #####
UCI GUI has no special user roles. It only differentiates authenticated and non-authenticated users. Users can register freely. The concept of users is necessary in order to associate uploaded games with users of the system.

##### Functionality #####
- Everybody can register a user in the system.
- Registered users can log in.
- Authenticated users can log out.
- Each authenticated user can upload games, queueing them for analysis.
- Each authenticated user can view a history of their uploaded games along with the progress of their analysis
- Each authenticated user can open and replay his uploaded games on a virtual chessboard.
- Each authenticated user can view an interactive chart of all moves in an analyzed game. Games that are not fully analyzed will display analysis information only up to the move they have been analyzed.

##### Performance #####
- All long running tasks should be performed in the background and their progress reported to the front-end.
- Smooth user experience and interactivity is preferred over fast loading times.
- Whenever possible data should be cached instead of recalculated multiple time.

##### User Experience #####
- Web interface should be a Single Page Application.
- All elements should be responsive for multiple viewport sizes. Minimal supported resolution is 1024x768px.

##### Web Browser Support #####
Latest version of Chrome and Firefox.

#### Target Technologies ####
##### Front end #####
- [JSPM](http://jspm.io/) as described on their homepage is a "frictionless browser package manager". This is the easiest tool for installing, maintaining and bundling client side JavaScript. It uses [System.js](https://github.com/systemjs/systemjs) as a universal module loader that supports transpiling to JavaScript on the fly in the browser for seamless development experience.
- [Angular 2](https://angular.io/) with [plugin-typescript](https://github.com/frankwallis/plugin-typescript). From all modern options for a front-end framework Angular 2 has been chosen since it is a full-fledged framework, promotes the usage of strictly typed constructs (TypeScript), is extremely fast, and has functional reactive programming baked into it with the support of [RxJS](https://github.com/ReactiveX/RxJS).
- [Chess js](https://github.com/jhlywa/chess.js) - A great library that provides chess oriented utilities (parsing PGNs and FENs, listing legal moves, etc) available both on the front-end and the back-end.
- [Chessboard.js](http://chessboardjs.com) - A chessboard visualization library with support for interactivity, theming and animations for smooth user experience.
- [Semantic UI](http://semantic-ui.com/) - A jQuery based UI framework (Bootstrap alternative) that provides clean and semantic way for categorizing and stylizing UI components.
- [Plotly js](https://plot.ly/javascript/) - A recently open sourced charting library with rich functionality and promising future. May be a bit overkill for the requirements of this project but it is good to have more options.
- [Socket IO](http://socket.io/) - A websocket wrapper that makes two-way communication between the client and the server easy and predictable.

##### Back-end #####
- [Node JS](https://nodejs.org) fits perfectly as a server for UCI GUI. It is the only technology that integrates seamlessly with all other necessary tools/libraries for the project so it is the logical choice.
- [Express](http://expressjs.com/) - The most stable and mature http server framework for Node JS with rich set of 3rd party plugins and middlewares.
- [Mongo db](https://www.mongodb.org/)- The perfect candidate for storing the chess games and their analysis in a document format with complex structure. UCI GUI does not have complex relations between its entities so Mongo is preferred over traditional relational databases.
- [Mongoose ODM](http://mongoosejs.com/) - An Object Document Mapper for Mongo that helps in writing MongoDB validation, casting and business logic boilerplate. Mongoose provides a straight-forward, schema-based solution to model our application data.
- [Passport JS](http://passportjs.org/) is a simple, unobtrusive authentication middleware for Node.js that provides 300+ authentication strategies.
- [Socket IO](http://socket.io/) - A websocket wrapper that makes two-way communication between the client and the server easy and predictable.
- [NPM uci](https://www.npmjs.com/package/uci) - A thin UCI protocol wrapper for Node JS that parially abstracts parsing command line output.
- [Stockfish chess engine](https://stockfishchess.org/) is the highest rated Open Source UCI chess engine and is the recommended option for UCI GUI beginners.
- [Rabbit MQ](https://www.rabbitmq.com/) for distributing the analysis [TO BE DISCUSSED]