const net = require('net')
const { finished } = require('stream')

const MESSAGE_SUMMARY = require('./messages/summary')
const MESSAGE_POOLS = require('./messages/pools')
const MESSAGE_EDEVS = require('./messages/edevs')
const MESSAGE_DEVDETAILS = require('./messages/devdetails')
const MESSAGE_GET_VERSION = require('./messages/get_version')

const PORT = process.env.PORT || 4028

const onerror = err => console.error(err)

const server = net.createServer(socket => {
  const buffers = []

  socket.on('data', data => buffers.push(data))

  finished(socket, { writable: false }, err => {
    if (err) return onerror(err)

    let request = Buffer.concat(buffers)

    try {
      request = JSON.parse(request.toString())
    } catch (err) {
      return onerror(err)
    }

    let response = null

    switch (request.cmd) {
      case 'summary':
        response = MESSAGE_SUMMARY
        break
      case 'pools':
        response = MESSAGE_POOLS
        break
      case 'edevs':
        response = MESSAGE_EDEVS
        break
      case 'devdetails':
        response = MESSAGE_DEVDETAILS
        break
      case 'get_version':
        response = MESSAGE_GET_VERSION
        break
    }

    if (response) socket.end(JSON.stringify(response))
    else socket.destroy()
  })
})

server.listen(PORT)
