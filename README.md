# Web3 Resume Server

1. Install
```
npm install
```

2. new an [Oauth app](https://github.com/settings/applications/new) and get `CLIENT_ID` and `CLIENT_SECRET` ;

3. create `.env` file and set variable `CLIENT_ID` , `CLIENT_SECRET` and `CALLBACK_URL`

4. Run
```
node index.js
```

## API

### 1. authenticate
get https://github.com/login/oauth/authorize?client_id=c92b9936d82ecea58f84 and then get the access_token
 callback from github 

### 2. github
get data from github and return the buidl's profile

GET `/github`

Parameters

| Name | Type | In  | Description |
| ---- | ---- | --- | ----------- |
| access_token |  string    |  header   |    get from github.com's callback         |

Response
```
{"data":{"name":"Tao","repositories":49,"following":77,"followers":69,"contributions":214,"score":409}}
```


