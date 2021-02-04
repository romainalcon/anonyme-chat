const app = require('express')();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

http.listen(PORT, () => {
    console.log('Listening on *:'+PORT);
});