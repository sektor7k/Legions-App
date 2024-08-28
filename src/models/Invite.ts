import { Schema, model, models, Document, Types } from 'mongoose';

export interface InviteDocument extends Document {
  teamId: Types.ObjectId;
  userId: Types.ObjectId;
  leadId: Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  invitedAt: Date;
  respondedAt?: Date;
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
}, {
  timestamps: true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
});

const Invite = models.Invite || model<InviteDocument>('Invite', inviteSchema);

export default Invite;
