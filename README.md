# Weather-Journal App Project

## Overview
This is an asynchronous web app that uses Web API and user data to retrieve weather data dynamically and update the UI. 

## Dependcies

1. **Dependencies that require installation**

    Use NPM to install the following packages

    - ExpressJs
        ```bash
            npm install express
        ```
    - CORS
        ```bash
        npm install cors
        ```
    - Body-Parser
        ```bash
        npm install body-parser
        ```
2. **Pre-installed dependencies** (installed in the index.html head)

    - jQuery - CDN
        ```html
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        ```
    - jQueryUI - CDN
        ```html
        <script type="text/javascript" src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js"></script>
        ```
    - Overhang.js - Stylesheet and JS file are pre-intalled in the website directory.
        ```html
        <link rel="stylesheet" type="text/css" href="overhang.min.css" />
        <script type="text/javascript" src="overhang.min.js"></script>
        ```

## Usage

- Use the line from your terminal to start the server
    ```bash
    node server.js
    ```
- Once the server is running go to [http://localhost:3000/](http://localhost:3000/) in your browser

- Enter a valid US zip code and how the weather feels then click the **Generate** button
