#uci-gui
## Web based platform for chess analysis ##

This project is created as part of the Software Technologies course at Plovdiv University. The idea is to provide a web based platform for chess game analysis with UCI engines.

## Docs ##
Find more info on motivation, targeted technologies and functional specification in the *doc* folder.

### Installation: ###
##### Prerequisites (yeah, we are not using Docker yet): #####
- Default Node JS installation
- Default Mongo DB installation

##### Setup: #####
```
npm install
node_modules/.bin/jspm install
```

##### Configuration: #####
Copy `config/engine.js.sample` to `config/engine.js` and specify the **full** path to your UCI engine executable of choice. Make sure the engine binary has appropriate execute permissions.

##### Run in development mode: #####
```
npm start
```

##### Run in production mode: #####
```
npm run production
```
