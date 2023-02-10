import mongoose from "mongoose";

const storageSchema = mongoose.Schema({
  name:{type: String, required: true},
  color: {type: String, required: true},
  position: {type: Number, required: true}
})

const Storage = mongoose.model('Storage', storageSchema)

export default Storage