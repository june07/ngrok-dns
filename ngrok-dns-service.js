/**
 * MIT License
 *
 *    Copyright (c) 2020 June07
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

const logger = require('./log'),
    axios = require('axios')

const REDIRECT_SERVICE = process.env.REDIRECT_SERVICE || 'ngrok-dns.june07.com',
    REDIRECT_SERVICE_APIKEY = process.env.REDIRECT_SERVICE_APIKEY,
    REDIRECT_SERVICE_USERID = process.env.REDIRECT_SERVICE_USERID
;

let missing = []
if (REDIRECT_SERVICE_APIKEY === undefined) missing.push('REDIRECT_SERVICE_APIKEY')
if (REDIRECT_SERVICE_USERID === undefined) missing.push('REDIRECT_SERVICE_USERID')

if (missing.length > 0) {
    logger(`ngrok-dns-service functionality is DISABLED because of missing (${missing.join()}) env variables`)
    return
}

class Service {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: `https://${REDIRECT_SERVICE}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${REDIRECT_SERVICE_APIKEY}`
            },
        })
    }
    async update(tunnelURL) {
        try {
            let axios = this.axiosInstance
            let response = await axios({
                    method: 'post',
                    url: `/add`,
                    data: JSON.stringify({
                        id: REDIRECT_SERVICE_USERID,
                        url: tunnelURL,
                    })
                })
                if (response.status == 200) logger(`updated redirect service ${response.data.redirect}`)
        } catch(error) {
            error
        }
    }
}

module.exports = new Service()
