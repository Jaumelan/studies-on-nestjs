# Car Price App
## Exercise using NestJs, Typeorm and SQLlite

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Because this is an exercise, the app uses sqllite and the Typeorm sinchronize is set true for development porpouse.
Many of the routes does not make sense in a real app, but those are there for practicing with Typeorm.
The hooks that are also inside the user entity are for helping visualize the process.
We also use the methods from the [Repository API](https://typeorm.io/repository-api).



## Structure of the app

![App Structure](readme-files/app-modules.jpeg)

## Users module routes

![User Routes](readme-files/user-module-routes.jpeg)

## Custom Serialization Interceptor
With a custom decorator

![User Interceptor](readme-files/user-interceptor.jpeg)