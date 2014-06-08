jsMcl
=====

Javascript implementation of the Monte Carlo Algorithm for robot localization

Install
=======
<ins>We assume node.js is installed, and you will use a html5 friendly browser (I tested on Chrome)</ins>
Use <code>npm install</code> to get external libraries.

    % npm install

Start local http server (express) with :

    % node server

Then open <code>http://localhost:3000</code> in your browser (tested in chrome)

Dependencies and inspirations
=============================

* express 3.x (to serve locally the application)
* [javascript-astar](https://github.com/bgrins/javascript-astar) - have a look to [the blog](http://www.briangrinstead.com/blog/astar-search-algorithm-in-javascript-updated), the astar.js has been used in this project.
* [gobot (by gokercebeci) Javascript MCL implementation with Javascript visual robot and particles management](https://github.com/gokercebeci/gobot)