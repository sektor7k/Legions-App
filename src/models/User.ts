import { Schema, model, models } from "mongoose";

export interface UserDocument {
  email: string;
  password: string;
  username: string;
  image: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isAdmin: boolean;
  forgotPasswordToken?: string;
  forgotPasswordExpire?: Date;
  verifyToken?: string;
  verifyExpire?: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  username: {
    type: String,
    required: [true, "Fullname is required"],
    minLength: [3, "fullname must be at least 3 chaacters"],
    maxLength: [25, "fullname must be at most 25 characters"],
  },
  image: {
    type: String, 
    default: "https://github.com/shadcn.png",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
  verifyToken: String,
  verifyExpire: Date,
}, {
  timestamps: true,
});

const User = models.User || model<UserDocument>('User', UserSchema);
export default User;
