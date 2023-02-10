import mongoose from "mongoose";

const parcelSchema = mongoose.Schema({
  barcode: {type: String, required: true},
  position: {type: String, required: true},
  company: {type: String, required: true},
  isOnStock: {
    type: Boolean,
    default: true
  },
  released: {
    type: String,
    default:'In Stock'
  },
  releasedAt: {
    type:Date
  },
  created: {
    type: String,
    required:true
  },
  returned: {
    type: Boolean,
    default: false
  },
  returnLocked: {
    type:Boolean,
    default: false
  }
},{timestamps:true})

const Parcel = mongoose.model('Parcel', parcelSchema)

export default Parcel