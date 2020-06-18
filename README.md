# BootShop - Shopify Theme
Shopify Started Theme powered by Bootstrap framework (v4), developed respecting [Shopify themes requirments](https://shopify.dev/tutorials/review-theme-store-requirements), accessbility best practices, and of course our own experince in developing themes for more than 15 years now.

## Note: 
Currently work in progress. We are constantly working with this project, and it should be completed within August 2020.

## Demo 
https://ks-bootshop.myshopify.com/

## Premium Shopify Themes 
In case you are interested in our Premium Shoipfy Themes, please visit our website
https://kondasoft.com

## Getting started
There are 2 ways to install our theme (or any other theme for that matter) on your Shopify store. 

1- The simpliest option, is by going to you Shopify Admin and installing the latest package (.zip file) from our [releases](https://github.com/kondasoft/ks-bootshop/releases/). In case you need help with this please check the [official tutorial](https://help.shopify.com/en/manual/online-store/legacy/using-themes/adding-themes#add-a-free-theme-from-the-admin) from Shopify. 

2- The second option is by using [Theme kit](https://shopify.github.io/themekit/), the the official command line tool from Shopify. This is the option which we will be covering below, as it gives you far more freedom to customize and modify our theme.

## Installation
**Note:** Please, make sure you are familiar with [Theme kit](https://shopify.github.io/themekit/), official documentation before proceding. We are assuming that at this point you have already installed Theme Kit.

### 1- Clone this repository (download theme files)
Create a new folder on your computer, `cd` to it and run the following command to copy all theme files from our GitHub repository master branch. Note: Include the dot at the end of the command to clone into the current directory.

`git clone https://github.com/kondasoft/ks-bootshop .`

### 2- Create and configure theme with Theme Kit
Run the folowing command to create a new theme in your Shopify store along with our theme files that you have just downloaded:

`theme new --password=[your-api-password] --store=[your-store.myshopify.com] --name="KS BootShop"`

Now, you may run this command to open your shopify store with our theme in preview mode.

`theme open`

### 3- Modifing styles (SCSS) and javascript.
You can run this 2 commands to compile and compress styles and scripts.

`npm run styles` will compile your Sass files from the `src/scss` folder to the `assets` folder

`npm run styles` will compile your JavaScript files from the `src/js` folder to the `assets` folder

Then, after you have finished making changes to your site, run the following command from Theme Kit to upload your changes to your Shopify store.

`theme deploy`

better yet, run the following command to start watching for changes and deploy them automatically.

`theme watch`

## Upgrading
This part will be covered soon.
