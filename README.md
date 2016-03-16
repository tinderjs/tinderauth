# tinderauth
Get your credentials for the Tinder API programatically

This module uses your FACEBOOK_USERNAME and FACEBOOK_PASSWORD to programatically get a token and your profile id, both of which are needed to authenticate with the http://www.github.com/tinderjs/tinder API.

First, run from the commandline:

`$ export FACEBOOK_EMAIL='your@email.com'`

`$ export FACEBOOK_PASSWORD='yourpassword'`

Then, from your file:

ES6:

```
import tinderauth from 'tinderauth';

(async function(){
  const { token, profile_id } = await tinderauth();
  console.log(token, profile_id);
})();
```

ES5: (doesn't work atm, give me a minute to fix this)

```
var tinderauth = require('tinderauth');

tinderauth.default().then(function(response){
  var token = response.token;
  var profile_id = response.profile_id;
  console.log(token, profile_id);
});
```

By the way, you may have concerns about using your FACEBOOK_EMAIL and FACEBOOK_PASSWORD. A couple points about this: 

First, if you would like an alternative, check out http://www.github.com/tinderjs/tindercred , you will have to manually copy your password and ID so it's not programmatic, but it's a nice option. 

Secondly, these variables are never shared with an outside service, and aren't in your source since they are exported with an environment variable. 

Lastly, and most importantly, you should *not* use these experimental technologies with your real Facebook account. Make a throwaway Facebook account so that if things glitch you don't lose privelleges with your real Facebook account. Therefore, you shouldn't ever need to worry about losing access to your real Facebok account, don't even use it with this module. 


To-Do:

- [ ] Get ES5 working ( dealing with a babel issue right now )
- [ ] Speed up ZombieJS scraping
- [ ] Add copyright and change to MIT license
