import mongoose, {Schema} from "mongoose";

// const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
/*
export const AccountSchema = mongoose.Schema({
    uid: {type: String, required:true},
    encryptedValue: {type: Object, required:true},
})*/
const AccountSchema = new Schema({
    uid: {type: String, required:true},
    encryptedValue: {type: Object, required:true},
})
export default mongoose.model('Account',AccountSchema)