import mongoose from "mongoose";

const companySchema = mongoose.Schema({
  name:{type: String, required: true},
  releaseUrl: {type: String, required: false},
})

const Company = mongoose.model('Company', companySchema)

export default Company