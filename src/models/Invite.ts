import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Invite schema
const inviteSchema = new Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Bu, hangi takım liderine bildirimin gideceğini belirtir
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
});

const Invite = mongoose.models.Invite || mongoose.model('Invite', inviteSchema);

export default Invite;
