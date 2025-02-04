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
    recordId,
    reason,
    amount,
    catagory,
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
    // Function to handle the file upload process
    const handleFileUpload = async (file, uploadFunction, type) => {
      if (file) {
        const result = await uploadFunction(file);
        if (!result?.success) {
          throw new Error(`${type} upload failed`);
        }
        return result.url;
      }
      return null;
    };

    // Upload audio if present
    audioPath = await handleFileUpload(audioFile, uploadAudio, 'Audio');

    // Upload image if present
    imagePath = await handleFileUpload(imageFile, uploadImage, 'Image');

    // If recordId exists, update the record
    if (recordId) {
      const record = await recordsModal.findById(recordId);
      if (!record) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }

      if(record.image && !imageFile ){
          imagePath = record.image;
      }
      if(record.audio && !audioFile ){
          audioPath = record.audio;
      }

      const updatedData = await recordsModal.findByIdAndUpdate(recordId, {
        reason,
        amount,
        catagory,
        type,
        person,
        mobile,
        isFromIncome,
        image: imagePath,
        audio: audioPath,
      }, { new: true });

      if (updatedData) {
        return res.json({ success: true, updatedData, message: "Record Updated!" });
      } else {
        return res.status(500).json({ success: false, message: "Update failed" });
      }
    }

    // Create new record if recordId is not provided
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

    const savedData = await newRecord.save();

    // If isDefault is true, handle default records
  if (isDefault) {
    const userData = await userModal.findById(user_id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find index of record with the same reason
    const existingRecordIndex = userData.defaultRecords.findIndex(
      (record) => record.reason === reason
    );

    if (existingRecordIndex === -1) {
      // If no existing record, add new record
      userData.defaultRecords.push(savedData);
    } else {
      // If record exists, update the amount
      userData.defaultRecords[existingRecordIndex].amount = amount;

      // Mark the field as modified (important for MongoDB to detect changes)
      userData.markModified(`defaultRecords.${existingRecordIndex}`);
    }

    await userData.save();
  }


    if (savedData) {
      return res.json({ success: true, savedData, message: "Record Added!" });
    } else {
      return res.status(500).json({ success: false, message: "Save failed, try later" });
    }

  } catch (error) {
    console.error("Error adding record:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
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
  

  export const deleteRecord = async (req, res) => {
    const { id } = req.params; // Assuming the ID is passed as a URL parameter

    try {
        const record = await recordsModal.findByIdAndDelete(id);

        // Check if record is found and deleted
        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        // Successful deletion
        return res.status(200).json({ success: true, message: "Record deleted successfully" });

    } catch (error) {
        console.error("Error deleting record:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};



