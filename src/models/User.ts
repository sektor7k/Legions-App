import { Schema, model, models } from "mongoose";

export interface UserDocument {
  email: string;
  password?: string;
  username: string;
  image: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  isVerifed: boolean;
  forgotPasswordToken?: string;
  forgotPasswordExpire?: Date;
  verifyToken?: string;
  verifyExpire?: Date;
  socialMedia?: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  wallets?: {
    evm?: string;
    solana?: string;
  };
  cryptoLoginNonce?: {
    nonce: string;
    expires: Date;
  };
  role: 'admin' | 'moderator' | 'user';
  status: 'active'| 'blocked'
  provider: "credentials" | "google"

}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    unique: true,
    required: [function () { return !this.wallets?.evm }, "Email is required"],
    sparse: true, // Email alanı dolu olduğunda benzersizlik kontrol edilir

    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ],
  },
  password: {
    type: String,
    required: function (this: UserDocument) {
      return this.provider === "credentials";
    },
  },
  provider: { type: String, required: true, default: "credentials" },
  username: {
    type: String,
    //required: [true, "Fullname is required"],
    required: false,
    minLength: [3, "fullname must be at least 3 chaacters"],
    maxLength: [25, "fullname must be at most 25 characters"],
  },
  image: {
    type: String,
    default: "https://github.com/shadcn.png",
  },
  isVerifed: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
  verifyToken: String,
  verifyExpire: Date,
  socialMedia: {
    twitter: { type: String, default: "" },
    discord: { type: String, default: "" },
    telegram: { type: String, default: "" },
  },
  wallets: {
    evm: { type: String, default: "" },
    solana: { type: String, default: "" },
  },
  cryptoLoginNonce: {
    nonce: { type: String },
    expires: { type: Date },
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const User = models.User || model<UserDocument>('User', UserSchema);
export default User;
