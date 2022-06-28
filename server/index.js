const ws = require('ws')

const wss = new ws.Server({
    port: 4000,
}, () => console.log('web socket started on port 4000'))


wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message);    
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                console.log(message)
                break
            case 'connection':
                broadcastMessage(message)
                break
        }
    })
})

const broadcastMessage = (message) => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}

