# Cloud Functions / Twall // GDG Lille ([@GDGLille](https://twitter.com/GDGLille)) 

[![Build Status](http://jenkins.bodul.fr/buildStatus/icon?job=GDG-Lille/twall-functions/master)](http://jenkins.bodul.fr/job/GDG-Lille/twall-functions/master)

## Made with ...
* [NPM](https://www.npmjs.com/) 
* [Typescript](https://www.typescriptlang.org/)
* [Firebase](https://firebase.google.com)

## How to build in production ?

Nothing to do, [Jenkins](https://jenkins.io/) does it :) (@see Jenkinsfile)

## How to test locally ?

First, you have to install [Firebase tools](https://github.com/firebase/firebase-tools) via `npm install -g firebase-tools`.

Now, go in the worker directory, go further in the **functions** directory and :
* Play `firebase functions:config:get > .runtimeconfig.json` ;
* Play `npm run serve` ;
* Let the magic happen

## What's in the box ?

There are only 1 function 
* *getTweetsForHashtag* which retrieve the last 50 tweets mentioning the specified hashtag (by default #DevFestLille).

## Contact via [Issues](https://github.com/GDG-Lille/twall/issues) on the [twall](https://github.com/GDG-Lille/twall) project
Helpful for **question**, **bug** and **contribution request**.

