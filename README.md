# Dev Guide: Create your own App

![Create your own app](./app-guide-main-img.jpg)

This repo contains all the code related to the [Create your own App guide](https://speckle.guide/dev/apps.html), which is part of our [Developer Docs](https://speckle.guide/dev)

> You can find the published app [HERE](https://hardcore-einstein-829a53.netlify.app/)
>
> [![Netlify Status](https://api.netlify.com/api/v1/badges/45628834-7477-42f8-9e2a-e8da5b4d2de1/deploy-status)](https://app.netlify.com/sites/hardcore-einstein-829a53/deploys)

Currently, only _Part I_ of the guide has been released. You can find a `tag` with the name `part-i` in the repo, which points to the final code for the corresponding parts. Future releases will follow the same pattern.

For instructions on how to install dependencies and basic setup, please consult the guide.

## Preview

![Full demo](./app-guide-full-demo.gif)

## Environment variables

You'll find an `.env.local` file already populated with some values. **Please remember to modify these values with your own, following the guide linked above.**

## Project setup

The setup scripts are just like any other `Vue.js` app:

### Install packages

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```
