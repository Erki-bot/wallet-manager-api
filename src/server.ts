import {NextFunction, Request, Response} from "express";
import AccountSchema from "../database/models/accountSchema";

const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require("body-parser")
const Eth = require('web3-eth')
export default class Server {
    private port: Number;

    constructor(port: Number) {
        this.port = port
    }

    isAlphanumeric(value: string) {
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        return alphanumericRegex.test(value);
    }

    start() {
        const app = express();
        mongoose.connect('mongodb+srv://erki:erki@cluster0.wnloab9.mongodb.net/?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => console.log('Connexion à MongoDB réussie !'))
            .catch(() => console.log('Connexion à MongoDB échouée !'));
        // app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', "*");
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            next()
        })
        app.post("/wallet", async (req: Request, res: Response) => {
                console.log("###########: ")
                console.log(req.body)
                let secret = req.body.secret || "lmjdiodocch";
                let uid = req.body.uid;
                /*
                if (!secret) {
                res.status(401).json({
                    error: "missing the secret code"
                })
            } else if (!uid) {
                res.status(401).json({
                    error: "missing the uid"
                })
            } else if (!this.isAlphanumeric(uid)) {
                res.status(401).json({
                    error: "invalid uid"

                })
            } else if (!this.isAlphanumeric(secret)) {
                res.status(401).json({
                    error: "invalid secret code"
                })
            }
                 */
                let check = this.check(uid, secret);
                if (!check.result) {
                    res.status(401).json({error: check.result})
                } else {
                    let a: any
                   try{
                       a = await AccountSchema.findOne({uid: uid})
                   }
                   catch (e) {
                       res.status(401).json({
                           error: "cannot connect to the database"
                       })
                       return
                   }
                    if (a) {
                        res.status(401).json({
                            error: `account with uid ${uid} already exist`
                        })
                    }
                    //alphanumeric verify
                    else {
                        const eth = new Eth(Eth.givenProvider);
                        let ethAccount = eth.accounts.create();
                        console.log(ethAccount)
                        let b = eth.accounts.encrypt(ethAccount.privateKey, secret)
                        const account = new AccountSchema({
                            uid: uid,
                            encryptedValue: b
                        })
                        account.save()
                            .then((act: any) => {
                                // console.log(act);
                                res.status(201)
                                    .json({
                                        address: ethAccount.address
                                    })
                            })
                            .catch((error: any) => res.status(401).json({
                                msg: "error when saving to the database",
                                error
                            }))
                    }
                }
            }
        )
        app.get('/wallet', async (req: Request, res: Response) => {
            const uid = req.body.uid;
            const secret = req.body.secret;
            let check = this.check(uid, secret)
            if (!check.result) {
                res.status(401).json({error: check.result})
            } else {
                let act: any;
                try{
                    act = await AccountSchema.findOne({uid: uid})
                }
                catch (e) {
                    res.status(401).json({
                        error: "cannot connect to the database"
                    })
                    return
                }
                if (!act) {
                    res.status(404).json({
                            error: `not account found for the user with the uid ${uid}. May be the uid or the secret is incorrect`
                        }
                    )
                } else {
                    const eth = new Eth(Eth.givenProvider);
                    let ethAccount = eth.accounts.decrypt(act.encryptedValue, secret);
                    console.log(ethAccount)
                    res.status(200).json({privateKey: ethAccount.priviteKey})
                }
            }
            //todo Validation of the inputs

        })
        app.listen(this.port, () => {
            console.log(`Server successfully started on the port ${this.port} !`);
        })
    }

    private check(uid: string, secret: string): { result: boolean, msg?: string } {

        if (!secret) {
            return {msg: "missing the secret code", result: false}
        } else if (!uid) {
            return {msg: "missing the uid", result: false}
        } else if (!this.isAlphanumeric(uid)) {
            return {msg: "invalid uid", result: false}
        } else if (!this.isAlphanumeric(secret)) {
            return {msg: "invalid secret code", result: false}
        }
        return {result: true}
    }
}