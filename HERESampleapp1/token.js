
const request = require('request');
const OAuth = require('oauth-1.0a')
const crypto = require('crypto'); 
require('dotenv').config()


console.log(process.env.CLIENT_ID)


function generateToken() {
  return new Promise(resolve => {
  const oauth = OAuth({
      consumer: {
          key: process.env.CLIENT_ID,
          secret: process.env.CLIENT_SECRET,
      },
      signature_method: 'HMAC-SHA256',
      hash_function(base_string, key) {
          return crypto
              .createHmac('sha256', key)
              .update(base_string)
              .digest('base64')
      },
  });
  const request_data = {
      url: 'https://account.api.here.com/oauth2/token',
      method: 'POST',
      data: { grant_type: 'client_credentials' },
  };

  request(
      {
          url: request_data.url,
          method: request_data.method,
          form: request_data.data,
          headers: oauth.toHeader(oauth.authorize(request_data)),
      },
      function (error, response, body) {

          if (response.statusCode == 200) {
            result = JSON.parse(response.body);
            let auth = 'Bearer '.concat(result["access_token"].toString());
            console.log(auth);
              resolve(auth);
          }
      }
  );
});
}

generateToken();