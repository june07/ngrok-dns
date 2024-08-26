/**
 * MIT License
 *
 *    Copyright (c) 2020-2024 June07
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a copy
 *    of this software and associated documentation files (the "Software"), to deal
 *    in the Software without restriction, including without limitation the rights
 *    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *    copies of the Software, and to permit persons to whom the Software is
 *    furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice shall be included in all
 *    copies or substantial portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
*/
'use strict'

const { REDIRECT_TUNNEL_SERVICE = 'ngrok' } = process.env

const dnsProvider = require('./cloudflare'),
    redirectService = require('./ngrok-dns-service')

let logEventHandler
if (REDIRECT_TUNNEL_SERVICE === 'ngrok') {
    logEventHandler = (listener, _error) => {
        const newTunnelURL = listener.url()

        if (redirectService) redirectService.update(newTunnelURL)
        if (dnsProvider) dnsProvider.dns_records.update({ type: 'TXT', content: newTunnelURL })
        return listener
    }
} else if (REDIRECT_TUNNEL_SERVICE === 'localtunnel') {
    logEventHandler = tunnelUrl => {
        if (redirectService) redirectService.update(tunnelUrl)
        if (dnsProvider) dnsProvider.dns_records.update({ type: 'TXT', content: tunnelUrl })
    }
}

module.exports = logEventHandler
