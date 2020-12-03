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

const TOKEN = process.env.CLOUDFLARE_TOKEN,
    ZONE_ID = process.env.CLOUDFLARE_ZONE_ID,
    TXT = process.env.TXT,
    CNAME = process.env.CNAME || 'ngrok.june07.com'

let missing = []
if (TOKEN === undefined) missing.push('CLOUDFLARE_TOKEN')
if (ZONE_ID === undefined) missing.push('CLOUDFLARE_ZONE_ID')
if (TXT === undefined) missing.push('TXT')
if (! (TOKEN && ZONE_ID && TXT)) {
    logger(`cloudflare functionality is DISABLED because of missing (${missing.join()}) env variables`)
    return false
}


class Cloudflare {
    constructor() {
        this.axiosInstance1 = axios.create({
            baseURL: 'https://api.cloudflare.com/client/v4/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
        }),
        this.axiosInstance2 = axios.create({
            baseURL: 'https://api.cloudflare.com/client/v4/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
        }),
        this.dns_records = {
            update: this.update.bind(this),
            updateTXT: this.updateTXT.bind(this),
            updateCNAME: this.updateCNAME.bind(this)
        }
    }
    async update(options) {
        let { type, content } = options
        
        if (type === 'TXT') this.updateTXT(content)
        else if (type === 'CNAME') this.updateCNAME(`${content}.${CNAME}`)
    }
    async updateTXT(content) {
        try {
            let axios = this.axiosInstance1
            let response = await axios({
                method: 'get',
                url: `zones/${ZONE_ID}/dns_records`,
                params: { name: TXT }
            })

            if (response.data.result.length > 0) {
                response = await axios({
                    method: 'patch',
                    url: `zones/${ZONE_ID}/dns_records/${response.data.result[0].id}`,
                    data: JSON.stringify({
                        type: 'TXT',
                        content,
                        ttl: '1'
                    })
                })
                if (response.data.success) logger(`ngrok-dns updated Cloudflare TXT ${TXT} -> ${content}`)
            } else {
                response = await axios({
                    method: 'post',
                    url: `zones/${ZONE_ID}/dns_records`,
                    data: JSON.stringify({
                        type: 'TXT',
                        name: TXT,
                        content,
                        ttl: '1'
                    })
                })
                if (response.data.success) logger(`ngrok-dns added Cloudflare TXT ${TXT} -> ${content}`)
            }
        } catch(error) {
            error
        }
    }
    async updateCNAME(name) {
        try {
            let axios = this.axiosInstance2
            let response = await axios({
                method: 'get',
                url: `zones/${ZONE_ID}/dns_records`,
                params: { name }
            })

            if (response.data.result.length > 0) {
                response = await axios({
                    method: 'patch',
                    url: `zones/${ZONE_ID}/dns_records/${response.data.result[0].id}`,
                    data: JSON.stringify({
                        type: 'CNAME',
                        content,
                        ttl: '1',
                    })
                })
                if (response.data.success) logger(`ngrok-dns updated Cloudflare CNAME ${CNAME} -> ${name}`)
            } else {
                response = await axios({
                    method: 'post',
                    url: `zones/${ZONE_ID}/dns_records`,
                    data: JSON.stringify({
                        type: 'CNAME',
                        name,
                        content: CNAME,
                        ttl: '1',
                    })
                })
                if (response.data.success) logger(`ngrok-dns added Cloudflare CNAME ${CNAME} -> ${name}`)
            }
        } catch(error) {
            error
        }
    }
}

module.exports = new Cloudflare()
