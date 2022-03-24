const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// Import the axios library, to make HTTP requests
const axios = require('axios');
require('dotenv').config();

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

const port = 3000;
// This is the client ID and client secret that you obtained
// while registering the application
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callbackURI=process.env.CALLBACK_URL;


/**
 * @desc callback from github and then get the access_token
 */
app.get('/authenticate/github', (req, res) => {
  const code = req.query.code;
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    const access_token = response.data.access_token;
    console.log(response.data);
    // redirect the user to the home page, along with the access token
    res.redirect(`/profile.html?access_token=${access_token}`);
  })
    .catch(function (error) {
      console.log(error);
    });
})

/**
 *@desc get data from github and return the buidl's profile
 */
app.get('/github', (req, res) => {
  const token = req.query.access_token;
  // graphql query
  const data = JSON.stringify({
    query: `query { 
    viewer {
      name
      repositories{
        totalCount
      }
      following {
        totalCount
      }
      followers {
        totalCount
      }
      contributionsCollection(
        from: "${(new Date(new Date().setFullYear(new Date().getFullYear() - 1))).toISOString()}"
        to: "${(new Date()).toISOString()}"
      ) {
        contributionCalendar {
          totalContributions
        }
      }
    }
  }`
  });
  const config = {
    method: 'post',
    url: 'https://api.github.com/graphql',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(response);
      const name= response.data.data.viewer.name;
      const repositories=response.data.data.viewer.repositories.totalCount;
      const following=response.data.data.viewer.following.totalCount;
      const followers=response.data.data.viewer.followers.totalCount;
      const contributions=response.data.data.viewer.contributionsCollection.contributionCalendar.totalContributions;
      const result={
        data:{
          name:name,
          repositories:repositories,
          following:following,
          followers:followers,
          contributions:contributions,
          score:repositories+following+followers+contributions
        }
      }
      console.log(result);
      res.json(result);
    })
    .catch(function (error) {
      console.log(error);
    });

})

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`web3_resume server listening on port port!`))