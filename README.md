# ngrok-dns

[![ngrok-dns]()](https://github.com/june07/ngrok-dns)

Ngrok-dns is a plugin of sorts that enables domain features of ngrok which are not available on the free plan.

  - Custom subdomain
  - Reserved domains

# Install
`npm install @667/ngrok-dns`

# Usage
```
const ngrok = require('./index'),
    ngrokDNS = require('@667/ngrok-dns');

(async function () {
    const url = await ngrok.connect({
        addr: 'https://localhost:3000',
        onLogEvent: ngrokDNS
    });
})();
```  
Make sure your env vars are set and run as normal:
 
    * CNAME
    * CLOUDFLARE_TOKEN
    * CLOUDFLARE_ZONE_ID

Log output should look like:
`ngrok-dns added Cloudflare CNAME your-custom-domain.com -> 0d8b12e869d7.ngrok.io`

Currently Cloudflare (token based) is supported although other DNS providers should be easy to add.

* ngrokDNS is middleware in that it passes the onLogEvent 'data' through, and failures just disable the middleware
