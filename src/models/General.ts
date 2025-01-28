import { Schema, model, models, Document } from "mongoose";

export interface GeneralDocument extends Document {
  tokenIds: string[]; // Dizinin string tipinde olduğunu belirtirsen iyi olur
}

const generalSchema = new Schema<GeneralDocument>(
  {
    tokenIds: {
      type: [String], // Bu şekilde tipini daha açık belirtebilirsin
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const General = models.General || model<GeneralDocument>("General", generalSchema);
export default General;
