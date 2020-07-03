# GitHub Stargazers

### Code and code design decisions:

- I decided to work with functions only instead of creating classes.
- I decided to separate routes from consollers to avoid express dependency on controllers
- I decided to create a "htppService" to isolate Axios dependency
- I created "githubService" to keep all the GitHub integrations in the same place. You can note that only functions that make sense to be used outside are exported.
- Every function on the "githubService" module does not chancge params or manipulate state outsade of its scope.
- Sort items by stars count is not a "githubService" responsibility, so at a certain point I moved this action to "repositoriesService"

### Main difficulties I found during the test:
- I lost 2 and a half days trying to understand why my stargazers' number are different from the real. So I realized that GitHub rest API limits the results to the first 40k stargazers. Searching on the internet, I don't find too much information about this problem, but I found [a reserach](https://homepages.dcc.ufmg.br/~mtov/pub/2016-icsme "research")  where this problem is mentioned and I also found [an article](https://medium.com/hackernoon/a-dive-into-freecodecamp-stargazers-667fdebfa111 "article" ) saying that its a limitation of rest API but it's possible to get all the stargazers using GraphQL. To finish, another interesting thing is that I couldn't find information about this 40k limitation in the official docs, but when we try to access more than 40k stargazers, for example, [react-native stargazers](https://api.github.com/repos/facebook/react-native/stargazers?per_page=100&page=401 "react-native stargazers"),  GitHub will return the following message "In order to keep the API fast for everyone, pagination is limited for this resource. Check the rel=last link relation in the Link response header to see how far back you can traverse.", interesting, not?. So... Due to this problem, any repository with more than 40k stars will return 40000 stars on my app ([domain]/repositories/[org]).
- A personal comment: I really miss Typescript, but the instructions are clear about why to use Javascript and I Agree

### App known mistakes and enhancements that I would like to solve if I have more time:
- Needs more unit tests
- Needs integration tests
- Needs error tracking and good logging
- Poor error handling
- Needs a retry strategy for solve [this issue]( https://github.com/leo2d/github-stargazers/issues/1 "Issue")  
- Add cache with Redis to avoid requesting the same data to GitHub Api in a short time


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

6. Now you can access ``` http://localhost:{your port}/repositories/{organization} ```, for example, ``` http://localhost:3334/repositories/facebook ``` and you will see the result in an array in the following format:
         
```json

        [
            {
                "name": "react",
                "stars": 40000
            },
            {
                "name": "react-native",
                "stars": 40000
            },
            {
                "name": "create-react-app",
                "stars": 40000
            },
            {
                "name": "jest",
                "stars": 31585
            },
        ]
        
```

7. Running Unit Tests:
    1. You will need to setup a **.env.test** file in the same way as the **.env.dev** file
    2. Then you can run __yarn test__ or __npm test__ to run the test suites
