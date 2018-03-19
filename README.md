# ShortlyApp
ShortlyApp is an URL shortener service that runs over Express and Angular 5

[DEMO](https://zl.cl) --> [https://zl.cl](https://zl.cl)

  - It uses Firebase for Facebook authentication.
  - Uses Angular as frontend (we should use React right now but...).
  - Uses Express as backend.
  - Uses MariaDB/MySQL as database server (we shouldn't but...).
  - Uses grunt for tasks.
  - Uses nginx as web-server. (You could not use it, but for SSL mindpeace I've add it to the stack)

# To Do!
  - Accept more authentication services.
  - Make nginx handle static files.
  - Use sessions instead of cookies
  - Filters for request flooding on IP
  - Show statistics for the URLs redirected. (This app stores the request for every redirect, but the backend calls are missing and obviously, the frontend is not ready for stats)

### Backend Installation
ShortlyApp requires [Node.js](https://nodejs.org/) v8+ and MariaDB 10.x or MySQL 5.x to run. 
Clone the repo and install the dependencies and start the server.

```sh
$ cd shortlyApp
$ npm install
```
### Frontend Installation
```sh
$ cd shortlyApp/angular
$ npm install
```

### Configuration

#### Firebase

As we use Firebase for authentication, you must register an app in Firebase (https://firebase.google.com/) (it's free, don't worry).

  - Get the private key: Go to Project settings -> Service Accounts -> Firebase Admin SDK and Generate NEW PRIVATE KEY. Save this key in shortlyApp/src/firebase-config.json.

#### Database

With MariaDB or MySQL, login and create a new database, then edit the file shortlyApp/src/config-sample.ts and configure as desired.

#### Other settings

ShortlyApp have two limits for the short url service, one for registered users and other for guest users. 
In the file shortlyApp/src/config-sample.ts you will find userDailyLimit and guestDailyLimit, this values are the amount of URLs that each type of user can short in one day.

By default, ShortlyApp comes configured to use the "zl.cl" domain, you can change it to whatever you want. The SSL option comes enabled by default, just disable it if you don't want that extra sauce.

#### Extra: NGINX

If you want to use nginx in your stack, use the following server configuration as example:
```sh
# Listen on port 80 and redirect to SSL
server {
         listen 80;
         server_name www.mydomain.com mydomain.com;
         return 301 https://mydomain.com$request_uri;
}
# Listen on port 443 and redirect to Express
server {
         server_name mydomain.com;
         listen 443 ssl
         ssl_certificate /path/to/fullchain.pem;
         ssl_certificate_key /path/to/privkey.pem;
         ssl_session_cache shared:le_nginx_SSL:1m;
         ssl_session_timeout 1440m;
         
         # We dont want to allow too many ciphers or protocols
         ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
         ssl_prefer_server_ciphers on;

         ssl_ciphers "ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS";
         ssl_dhparam /path/to/ssl-dhparams.pem;
         # Beware of the port, by default ShortlyApp runs on 8080
         location / {
            proxy_pass http://127.0.0.1:8080;
            proxy_http_version 1.1;
            proxy_set_header   X-Forwarded-For $remote_addr;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
         }
         location = /favicon.ico {
            return 404;
         }
}
# Listen on port 443 and redirect to non-www
server {
         server_name www.mydomain.com;
         listen 443 ssl
         ssl_certificate /path/to/fullchain.pem;
         ssl_certificate_key /path/to/privkey.pem;
         ssl_session_cache shared:le_nginx_SSL:1m;
         ssl_session_timeout 1440m;
         
         # We dont want to allow too many ciphers or protocols
         ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
         ssl_prefer_server_ciphers on;

         ssl_ciphers "ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS";
         ssl_dhparam /path/to/ssl-dhparams.pem;
         return 301 https://mydomain.com$request_uri;
}
```
### Development
If you want to make other amazing features for this repo, it's easier to keep rocking.

#### Backend: run dev server
```sh
$ cd shortlyApp
$ npm run grunt
```
This will launch nodemon and typescript to compile whenever there's changes in the code.

#### Frontend: build watch
```sh
$ cd shortlyApp/angular
$ npm run build
```
This will run the build process of Angular and watch for changes.

After this, you can use any IDE of your choice and setup SFTP/FTP.

### Backend API
The backend always answer a JSON and has the following structure:
- status <int>: 1 when the request was successful and 0 when something happen.
- statusCode <string>: Is the representation of the success or error of the request.
- error <string>: If the status is 0, this will be a descriptive message of the error.
- data <object>: If the request needs to give data results, they will live in this object.

### GET '/:suffix'
This call will redirect if the :suffix exists and store data from the request to make stats, if the suffix don't exists, it will redirect to the default domain in the configuration.

### GET '/user/urls'
This call will give all the URLs that the user shorted using the service.

Expected params:
- token <string>: This is the token of the user that Firebase returns.

Possible Answers:
The token is invalid
```sh
   {
        'status': 0,
        'statusCode': 'user-urls/not-logged',
        'error': 'You need to be logged in!'
   }
```
The user don't have any URL
```sh
   {
        'status': 0,
        'statusCode': 'user-urls/not-found',
        'error': 'URLs for the user not found'
   }
```
The user has one or more URLs associated, the data is an array of objects with the keys shortURL and originalURL. Note: the shortURL will include the default domain, is not just the suffix.
```sh
   {
        'status': 1,
        'statusCode': 'user-urls/get',
        'data': [{ originalURL, shortURL}],
   }
```
### POST '/shorten'
This call will shortify the given URL.

Expected body:
- url <string>: This is the URL to shortify.
- token <string> [optional]: This is the token of the user that Firebase returns.

Possible Answers:
The guest pass the daily limit:
```sh
   {
        'status': 0,
        'statusCode': 'shorten/guest-limit',
        'error': 'You have already ' + req.app.get('config')['guestDailyLimit'] + ' links, register to get more!'
   }
```
The request comes with a token of a user that isn't logged in.
```sh
   {
        'status': 0,
        'statusCode': 'shorten/user-not-found',
        'error': 'User not found! check your token'
   }
```
A registered user pass the daily limit:
```sh
   {
        'status': 0,
        'statusCode': 'shorten/user-limit',
        'error': 'You have already ' + req.app.get('config')['userDailyLimit'] + ' links!'
   }
```
The given URL is not actually an URL:
```sh
   {
        'status': 0,
        'statusCode': 'shorten/bad-url',
        'error': 'The URL specified is not really an URL, please check if you added the protocol (http or https)'
    }
```
There's no URL in the body of the request!
```sh    
   {
        'status': 0,
        'statusCode': 'shorten/parameters-error',
        'error': 'You need to specify the URL!'
    }
```
### POST '/user'
Expected body:
- token <string>: This is the token that Firebase returns after login.
- displayName <string>: This is the name of the user that Firebase returns.

Possible Answers:
If the user that's trying to create already exists:
```sh
   {
        'status': 0,
        'statusCode': 'user/not-created',
        'error': 'User already exists!'
   }
```
else
```sh
   {
        'status': 1,
        'statusCode': 'user/created',
   }
```

If the user is not logged in:
```sh
   {
        'status': 0,
        'statusCode': 'user/not-logged',
        'error': 'You need to be logged in!'
   }
```       

