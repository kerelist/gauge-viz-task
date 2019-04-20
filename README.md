# gauge-viz-task

## init & options

`npm install` - for project installation. run first.

`webpack` or `npm run dev` -  default command. runs babel, js bundler and sass compiler.

`npm run watch` - runs the above and watches for changes.

`npm run build` - for production. runs babel, js bundler, js uglify, sass compiler, and sass minification.

(see `scripts` in `package.json` for details)

## purpose

this project will show a gauge visualisation of three numbers (or tell the user if there's an issue).

on start/restart, the following happens:
1. fetch made to https://widgister.herokuapp.com/challenge/frontend
2. if viable data, it is put into the min/max/value placeholders on the page & the needle is moved. also, a screenreader alert will run with the same information.
3. if the data is viable but impossible, a banner appears informing the user as such
4. if there is no data (i.e. an error), a "There is no value available." message will display.

## webpack
This setup is meant for simple projects (i.e. one output css file from sass, one js bundle only) and is from my own webpack setup ([code & further notes on github](https://github.com/kerelist/webpack-setup)).

## to be improved

next steps to improve this would be:
- add the currency unit to the min and max numbers - i just fully missed this the first time around!
- better error handling. i would like there to be some animated fire or emoji or something when the server returns the error "the server is on fire"
- some sort of testing?
- if this application was part of a larger set, a framework such as react or vue may better handle state for multiple components. i didn't use here because there was only one major component so i didn't feel it needed the extra setup time
- better accessibility - i would like to bake this in to the existing components and numbers instead of having it as a separate alert at the end. i feel this would be better for users with some vision remaining as the number readouts will be more tied to the visual on screen