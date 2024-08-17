import mongoose from "mongoose";

const previewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  resumeData: { type: Object, required: true },
});

const PreviewModel = mongoose.model("Preview", previewSchema);

export default PreviewModel;
