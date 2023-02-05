import {NextFunction, Request, Response} from "express";

const express = require('express');
const bodyParser = require("body-parser")

export default class Server {
    private port: Number;

    constructor(port: Number) {
        this.port = port
    }

    start() {
        const app = express();
        // app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use((req:Request,res:Response,next:NextFunction)=>{
            res.setHeader('Access-Control-Allow-Origin',"*");
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
         /*   setTimeout(()=>{
                next()
            },3000)*/
            next()
        })
       /* app.use("/",(req:Request,res:Response)=>{
            res.json ({msg: "Hello, World"});
        })*/
        app.post("/wallet",(req:Request,res:Response)=>{
            console.log("###########: ")
            console.log(req.body)
            res.json({msg:"success"})
        })
        app.listen(this.port, () => {
            console.log(`Server successfully started on the port ${this.port}`)
        })
    }
}