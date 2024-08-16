import { Schema, model, models } from "mongoose";

export interface TournamentDocument {
  thumnail: string;
  tname: string;
  tdescription: string;
  checkin: Date;
  checkinTime: string;
  starts: Date;
  startsTime: string;
  ends: Date;
  endsTime: string;
  teamsize: string;
  teamcount: string;
  region: string;
  bracket: string;
  prizePool?: Array<{
    key: string;
    value: string;
  }>;
}

const TournamentSchema = new Schema<TournamentDocument>({
  thumnail: {
    type: String,
    required: true,
  },
  tname: {
    type: String,
    required: true,
  },
  tdescription: {
    type: String,
    required: true,
  },
  checkin: {
    type: Date,
    required: true,
  },
  checkinTime: {
    type: String,
    required: true,
  },
  starts: {
    type: Date,
    required: true,
  },
  startsTime: {
    type: String,
    required: true,
  },
  ends: {
    type: Date,
    required: true,
  },
  endsTime: {
    type: String,
    required: true,
  },
  teamsize: {
    type: String,
    required: true,
  },
  teamcount: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  bracket: {
    type: String,
    required: true,
  },
  prizePool: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
}, {
  timestamps: true,
});

const Tournament = models.Tournament || model<TournamentDocument>('Tournament', TournamentSchema);
export default Tournament;
