const log = console.log

const yellow = '\x1b[33m',
    off = '\x1b[0m';
const name = `[${yellow}ngrok-dns${off}]`

function logger(message) {
    log(`${name} ${message}`)
}

module.exports = logger