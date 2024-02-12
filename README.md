# recipes-website
A website to show recipes from a public API.  
Created and developed by Manuel Fé Santos

Check out my other projects on [Github](https://www.github.com/manuelfesantos)

Check my profile on [LinkedIn](https://www.linkedin.com/in/manuelfesantos)

## How does it work?
It uses EDAMAM API to fetch recipes based on keyword search and JustTheRecipe to show the recipe's preparation steps

## Getting Started
To start, run `npm install` to install the node modules.

To run the website in dev mode, simply run `npm run dev` command. This is enough to see how the website works.

To run the website in prod, you need 2 commands:

```npm run build```

```npm run start```

## Architecture
This project is build with Typescript Next.js 

The source folder is divided in 5 folders:

Pages: Components used by the Page Router to render components into the html page.

Components: Reusable entities that enable the website's responsiveness and modularity

Styles: CSS modules that style each component, based global variables defined in ``globals.css``

Types: Types that are shared between all components, utils and pages to ensure a type compatibility between the whole project.

Utils: Utility .ts files that allow connection to external services