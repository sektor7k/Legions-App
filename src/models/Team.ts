import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the member schema
const memberSchema = new Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  isLead:{
    type:Boolean
  }
});

// Define the team schema
const teamSchema = new Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tournament', // assuming you have a Tournament model
  },
  teamName: {
    type: String,
    required: true,
  },
  teamImage: {
    type: String,
    required: true,
  },
  status: {
    type: String, // or any other statuses you want
    required: true,
  },
  members: [memberSchema],
});

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

export default Team;
