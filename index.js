const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io')(http);
const faker = require('faker');
const { Console } = require('console');
faker.setLocale('fr');
const PORT = process.env.PORT || 5000;

/**
 * Liste des utilisateurs
 * @type {*[]}
 */
let users = [];

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    let username = faker.name.firstName() + ' (' + (Math.floor(Math.random() * 999) + 1) + ')';
    let userid;
    let admin = false;

    /**
     * En cas de connexion
     */
    socket.on('connected', (id) => {
        userid = id;
        users.push(username);
        io.emit('chat_message', '[<span style="color: #42B823; font-weight: bold">#</span>] '+username);
        io.emit('user_connected', {user: username, id: userid, usersList: users})
    });

    /**
     * En cas de déconnexion
     */
    socket.on('disconnect', () => {
        io.emit('chat_message', '[<span style="color: #E5312B; font-weight: bold">#</span>] '+username);

        /**
         * Retirer de la liste
         */
        let newUsers = [];
        users.forEach(value => {
            if (value !==  username) {
                newUsers.push(value);
            }
        });
        users = newUsers;

        /**
         * Envoyer la suppression de l'utilisateur
         */
        io.emit('user_disconnected', username);
    });

    /**
     * En cas d'envoie de message
     */
    socket.on('chat_message', (msg) => {
        let normal = true;
        let words = msg.split(" ");
        for (i = 0; i < words.length; i++) {
            /**
             * Liste des mes regex 
             */
            if (words[i].match("https?:\/\/[a-z0-9\/:%_+.,#?!@&=-]+")) {
                words[i] = '<a target="_blank" href="'+words[i]+'">'+words[i]+'</a>';
            }
        }

        msg = words.join(" ");
        
        /* Test si login */
        if (words.length == 2 && words[0] == '#login') {
            normal = false;
            if (words[1] === 'romain') {
                admin = true;
                msg = '<span class="login">'+username+' vient de passer admin !'+'</span>';
            } else {
                admin = false;
                msg = '<span class="login">'+username+' vient d\'essayer de devenir admin !'+'</span>';
            }
        }
        
        if (normal) {
            io.emit('chat_message' ,'<strong>'+username+':</strong> '+msg);
        } else {
            io.emit('chat_message' ,msg);
        }
    });
});

http.listen(PORT, () => {
    console.log('Listening on *:'+PORT);
});
