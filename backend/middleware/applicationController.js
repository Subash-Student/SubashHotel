import recordsModal from "../model/recordModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier"
import userModal from "../model/userModel.js";










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






export const addRecordDetails = async (req, res) => {
  const {
    reason,
    amount,
    catagory,  // Fixed typo
    type,
    isDefault,
    person,
    mobile,
    isFromIncome
  } = req.body;

  const user_id = req.id;
  const imageFile = req.files?.image ? req.files.image[0] : null;
  const audioFile = req.files?.audio ? req.files.audio[0] : null;

  let imagePath = null;
  let audioPath = null;

  try {
    // Upload audio if present
    if (audioFile) {
      const audioResult = await uploadAudio(audioFile);
      if (!audioResult?.success) {
        return res.status(500).json({ error: "Audio upload failed" });
      }
      audioPath = audioResult.url;
    }

    // Upload image if present
    if (imageFile) {
      const imageResult = await uploadImage(imageFile);
      if (!imageResult?.success) {
        return res.status(500).json({ error: "Image upload failed" });
      }
      imagePath = imageResult.url;
    }

    // Create new record
    const newRecord = new recordsModal({
      user_id,
      reason,
      amount,
      catagory,
      type,
      person,
      mobile,
      isFromIncome,
      image: imagePath,
      audio: audioPath,
    });

    let isSavedData = await newRecord.save();

    if (isDefault) {
      const userData = await userModal.findById(user_id);
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      let isSameDefaultRecord;

      if(userData.defaultRecords.length == 0){
        isSameDefaultRecord = false;
      }else{
        isSameDefaultRecord =  userData.defaultRecords.some(record =>
         record.reason === reason && record.amount === Number(amount)
     );

      }
    
    

    
    
       console.log(isSameDefaultRecord)
      if (!isSameDefaultRecord) {
        userData.defaultRecords.push(isSavedData); // Fixed incorrect push syntax
        await userData.save();
      }
    }

    if (isSavedData) {
      return res.json({ success: true, isSavedData, message: "Record Added!" });
    } else {
      return res.status(500).json({ success: false, message: "Save failed, try later" });
    }
  } catch (error) {
    console.error("Error adding record:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

  

  async function uploadAudio(file) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // Treat audio as video
          folder: "audio-recordings",
          public_id: file.originalname, // Optional: Set the public ID
        },
        (error, result) => {
          if (error) {
            console.error("Audio upload error:", error);
            reject({ success: false });
          } else {
            resolve({ success: true, url: result.secure_url });
          }
        }
      );
  
      // Convert the buffer to a readable stream and pipe it to Cloudinary
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
  
  
  async function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "image-files",
            resource_type: "image",
            public_id: file.originalname, // Optional: Set the public ID
          },
          (error, result) => {
            if (error) {
              console.error("image upload error:", error);
              reject({ success: false });
            } else {
              resolve({ success: true, url: result.secure_url });
            }
          }
        );
    
        // Convert the buffer to a readable stream and pipe it to Cloudinary
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
  }
  

  