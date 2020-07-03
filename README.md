# GitHub Stargazers


### Into the stack:

This project use some popular libraries:

- [Express]( https://expressjs.com/ "Express") - Used for build the server

- [Cors]( https://expressjs.com/en/resources/middleware/cors.html "Cors") - Used for provide access resources from remote hosts

- [Compression]( http://expressjs.com/en/resources/middleware/compression.html "Compression") - Used for compress the response data with gzip

- [Axios]( https://github.com/axios/axios "Axios") - Used for make http requests

- [Jest]( https://jestjs.io/ "Jest") - Used as test runner and for mock/spy

- [CrossEnv]( https://github.com/kentcdodds/cross-env#readme "cross-env") - Used for setup NODE_ENV manually on scripts section, especially on 'test' script. 

- [DotEnv]( https://github.com/motdotla/dotenv#readme "dotenv") - Used for setup environment variables with a file(check [.env.example]( https://github.com/leo2d/github-stargazers/blob/master/src/config/.env.example ".env.example")). Using in development/ test envs only.

### How to run locally:

***Before runs make sure you have Node Js installed on your machine***

1. Clone this repository and navigate to its folder
2. Then run __yarn__ or __npm i__
3. [Click here](  https://github.com/settings/tokens "tokens") to create a token that you'll use to auth on Github Api
    
4. Setup the environment variables:
    1. create a **.env.dev** file in _src/config_
    2. Then change the value of the following properties according to yours:  
    
            
        **IMPORTANT**: In the GITHUB_API configuration, the API routes and other settings should be changed only if the GitHub API really changes.
         My suggestion is that you simply copy and paste the example below and replace the token _GITHUB_API_TOKEN_ variable with your token.
         
        ```env

        //.env.dev
        #server config
        SERVER_PORT = 3334

        ##Github config
        GITHUB_API_BASE_URL = 'https://api.github.com'
        GITHUB_API_ORGS_PATH = '/orgs'
        GITHUB_API_REPOS_PATH = '/repos'
        GITHUB_API_PAGE_QUERY = 'page'
        GITHUB_API_PER_PAGE_QUERY = 'per_page'
        GITHUB_API_PER_PAGE_LIMIT = 100
        GITHUB_API_TOKEN = 'your token here'
        
        ```

    
5. Finally you can run __yarn debug__ or __npm run debug__ to run in debug mode with nodemon or just __yarn start__ or __npm start__ to start the application

6. Running Unit Tests:
    1. You will need to setup a **.env.test** file in the same way as the **.env.dev** file
    2. Then you can run __yarn test__ or __npm test__ to run the test suites
