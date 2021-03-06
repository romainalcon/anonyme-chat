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
let usersId = [];

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    let usernameId = (Math.floor(Math.random() * 999) + 1);
    let username = faker.name.firstName() + ' (' + usernameId + ')';
    let userid;
    let admin = false;
    let muted = false;

    /**
     * En cas de connexion
     */
    socket.on('connected', (id) => {
        userid = id;
        users.push(username);
        usersId.push(usernameId);
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
         * Retirer de la liste
         */
        let newUsersId = [];
        usersId.forEach(value => {
            if (value !==  usernameId) {
                newUsersId.push(value);
            }
        });
        usersId = newUsersId;

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
                io.emit('personal_message', {id: userid, msg: '<span class="login">Vous venez de passer admin !</span>'});
            } else {
                admin = false;
                io.emit('personal_message', {id: userid, msg: '<span class="login">Ce n\'est pas le bon mot de passe !</span>'});
            }
        }

        if (admin && words.length >= 1) {
            if (words[0] == '#name' && words.length == 2) {
                normal = false;
                let beforeUsername = username;
                username = words[1] + ' (' +  usernameId + ')';
                for (let i = 0; i < users.length; i++) {
                    if (users[i] == beforeUsername) {
                        users[i] = username;
                    }
                }
                io.emit('replace_list', {before: beforeUsername, after: username});
                io.emit('personal_message', {id: userid, msg: '<span class="login">Tu viens de devenir '+username+' !</span>'});
            }

            if (words[0] == '#refresh' && words.length == 1) {
                io.emit('refresh_all');
            }
        }
        
        if (normal) {
            io.emit('chat_message' ,'<strong>'+username+':</strong> '+msg);
        }
    });
});

http.listen(PORT, () => {
    console.log('Listening on *:'+PORT);
});
