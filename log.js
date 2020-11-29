const yellow = '\x1b[33m',
    off = '\x1b[0m';
const name = `[${yellow}ngrok-dns${off}]`

function logger(message) {
    console.log(`${name} ${message}`)
}

module.exports = logger