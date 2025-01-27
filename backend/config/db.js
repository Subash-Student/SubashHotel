import mongoose from"mongoose";


const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://subashmurugan2021:tpdg7AJ06411ubJT@cluster0.nvvfx.mongodb.net/<dbname>?retryWrites=true&w=majority").then(()=>{
        console.log("DB connected");
    }).catch(e=>{console.log(e)});
}
export default connectDB;












