import mongoose from "mongoose";



const reasonRecordSchema = new mongoose.Schema({
    user_id:{ type:String,required:true },
    catagory:{ type:String,requird:true },
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true }, 
    person: { type: String },
    mobile: { type: String , },
    image: { type: String },
    audio: { type: String }, 
    createdAt: { type: Date, required: true, default: Date.now },
    isFromIncome:{ type: Boolean, required:true },
   
    
});

const recordsModal = mongoose.model.records || mongoose.model("record",reasonRecordSchema);

export default recordsModal;