import { Schema, model, models, Document, Types } from 'mongoose';

export interface InviteDocument extends Document {
  teamId: Types.ObjectId;
  userId: Types.ObjectId;
  leadId: Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  invitedAt: Date;
  respondedAt?: Date;
  inviteType:'memeber' | 'leader';
}

const inviteSchema = new Schema<InviteDocument>({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  invitedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
  inviteType: {
    type: String,
    enum: ['member', 'leader'], // Sadece 'member' ve 'leader' değerlerini alabilir
    required: true,
  }
}, {
  timestamps: true, 
});

const Invite = models.Invite || model<InviteDocument>('Invite', inviteSchema);

export default Invite;
