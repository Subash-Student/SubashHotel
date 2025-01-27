import recordsModal from "../model/recordModel.js";












export const getReocrds = async (req,res)=>{

    const userId = req.id;

    try {
        const records = await recordsModal.find({});
        if(!records){
           return res.json({success:false,message:"No Records Found"})
        }

        return res.json({success:true,records:records})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:"Error,Please Try Later!"})
    }

}