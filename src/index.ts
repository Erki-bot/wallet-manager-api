import Server from "./server";
// const mongoose = require('mongoose')
const server = new Server(8081);
const Eth = require('web3-eth')
// const eth = new Eth(Eth.givenProvider);
// let a = eth.accounts.create();
// let b = eth.accounts.encrypt(a.privateKey,"kdsuichiucheucuhicniehnuichsucejczopjf")
/*mongoose.connect('mongodb+srv://erki:erki@cluster0.wnloab9.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));*/
// console.log(a.privateKey)
server.start()