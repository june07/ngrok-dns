# ngrok-dns
[![ngrok-dns](https://img.shields.io/github/package-json/v/june07/ngrok-dns)](https://github.com/june07/ngrok-dns) [![ngrok-dns](https://img.shields.io/npm/v/@667/ngrok-dns)](https://github.com/june07/ngrok-dns)

Ngrok-dns is a plugin of sorts to the [ngrok](https://www.npmjs.com/package/ngrok) npm package that enables domain features of ngrok which are not available on the free plan.
Ngrok-dns will create a TXT record pointing to the new tunnel each time it changes.

|[![ngrok-dns](https://june07.github.io/ngrok-dns/tempsnip.png)](https://github.com/june07/ngrok-dns)|
|:---:|
| ngrok tunnel url is dynamic and will change during your development cycle |

|[![ngrok-dns](https://res.cloudinary.com/june07/image/upload/v1606674450/june07/Capture-cloudflare-ngrok-txt.png)](https://github.com/june07/ngrok-dns)|
|:---:|
| cloudflare TXT records can then be easily accessed from webhooks and other disconnected parts of dev project |
  - Custom subdomain
  - Reserved domains

# Install
`npm install @667/ngrok-dns`

# Usage
|[![ngrok-dns](https://res.cloudinary.com/june07/image/upload/v1606675182/june07/Capture-codeExample-ngrok-dns.png)](https://github.com/june07/ngrok-dns)|
|:---:|
| highlighed locations show requirement for ngrok-dns usage |

```node
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
[![ngrok-dns](https://res.cloudinary.com/june07/image/upload/v1606675846/june07/Capture-commandLine-ngrok-dns.png)](https://github.com/june07/ngrok-dns)
* ~~CNAME~~ TXT (ngrok seems to block requests with Host headers not matching their dynamic url!  So instead a TXT record is created which
    can easily be looked up in your dev environment using Node's included dns module:
`require('dns')`
* CLOUDFLARE_TOKEN
* CLOUDFLARE_ZONE_ID

Log output should look like:
`ngrok-dns added Cloudflare TXT your-custom-domain.com -> 0d8b12e869d7.ngrok.io`

This is a seperate example of ngrok-dns output:
[![ngrok-dns](https://res.cloudinary.com/june07/image/upload/v1606676283/june07/Screenshot_2020-11-29_105348.png)](https://github.com/june07/ngrok-dns)

Currently Cloudflare (token based) is supported although other DNS providers should be easy to add.

* ngrokDNS is middleware in that it passes the onLogEvent 'data' through, and failures just disable the middleware
