# Neighborhood Map

# Get started
The app *must* run on a server to get it work properly.
1. Clone or download the repository to your local machine
2. Install node.js
3. Open terminal, `cd` to the root folder of the project
4. In terminal, run `npm install http-server -g` to install *http-server*
5. In the root folder of the project, run `http-server` to start the server.
6. After the http-server successfully run, please follow the guidelines in terminal and open the available address such as `http://127.0.0.1:8080` or `http://127.0.0.1:8080` to start.
 
# For further developement
If you want to develop the Neighborhood Map base on this version, please
1. clone or download the repository to your local machine
2. initialize git for version control
3. if you have installed node.js on your machine, run `npm install` in terminal in the project root folder. You should have the dev-depenencies and preset installed. If you haven't install node.js, please go to [node.js official site](https://nodejs.org/en/) and get one.
4. now your should be ready to start development
  
# Build project 
- All sources files of javascript and css are located in folder `src`.
- To update core javascript, please find `src/js/app.js`
- You should run `npm run babel` to convert it to ES2015 if the index.html includes the `dist/js/app.js`.
- You can also change the script src to `src/js/app.js` if you want to develop under ES6 version. 
- All build output files are in folder `dist`

## transpile javascript ES6 to ES2015 in Babel
- ensure `<script src="dist/js/app.js"></script>` has been included before `</body`
- open terminal to the root folder, run following command:  
```es62es2015
npm run babel
```
- The app.js in `/src/js` folder which is in ES6 should have been transpiled to ES2015. 

# Update CSS
In this project, all CSS are written in .scss files and transpiled to CSS. 

To modify CSS style, always find the source file in .scss in folder `./src/scss/`. 

Once you make chages, you should run following command to transpile SCSS to CSS format. 

```scss2css
npm run build-css
```

To make CSS auto transpile the file when changes detected, you should try `watch` method to make it efficient.

1. Install [SASS](http://sass-lang.com/install) to your local
2. In terminal, `cd` to the project root folder, run following commend:
```scss2css
npm run watch-css
```
3. Done. Once you update styles in SCSS files, the SCSS file should be transpiled and sent to the output folder `dist/css/app.css`


# Set your Google Map with your API Key
1. On the bottom of `index.html` before the `</body>`, you should find the google map JavaScript API script:
```angular2html
<script async defer
        src="https://maps.googleapis.com/maps/api/js?key=Your_key">
</script>
```
Please change `Your_key` to your api key. 
If you need a Google Map API key, please go to the [Google Map Developer site](https://developers.google.com/maps/).  


## Dependencies
This project is using following frameworks and libraries
* MVVM Framework - [knockout.js v3.4.2](http://knockoutjs.com/)
* AJAX - [jQuery 3.2.1](https://api.jquery.com/jQuery.ajax/)
* CSS preprocessor - [SASS](http://sass-lang.com/)
* Initialise basic styles across browsers - [normalize.scss v7.0.0](https://github.com/JohnAlbin/normalize-scss) 
* Map - [google map JavaScript API](https://developers.google.com/maps/documentation/javascript/)
* Menu Icon image - [feather icons](https://feather.netlify.com/)
* Wikipedia information - [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page)