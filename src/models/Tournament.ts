import { Schema, model, models } from "mongoose";

export interface TournamentDocument {
  thumbnail: string;
  thumbnailGif: string;
  tname: string;
  tdescription: string;
  organizer: string;
  organizerAvatar: string;
  participants: number;
  capacity: number;
  checkin: string;
  checkinTime: string;
  starts: string;
  startsTime: string;
  ends: string;
  endsTime: string;
  teamsize: string;
  teamcount: string;
  region: string;
  bracket: string;
  prizePool?: Array<{
    key: string;
    value: string;
  }>;
  sponsors?: string[];
  currentphase: string
}

const TournamentSchema = new Schema<TournamentDocument>({
  thumbnail: {
    type: String,
    required: true,
  },
  thumbnailGif: {
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
  organizer: {
    type: String,
    required: true,
  },
  organizerAvatar: {
    type: String,
    required: true,
  },
  participants: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: true,
  },
  checkin: {
    type: String,
    required: true,
  },
  checkinTime: {
    type: String,
    required: true,
  },
  starts: {
    type: String,
    required: true,
  },
  startsTime: {
    type: String,
    required: true,
  },
  ends: {
    type: String,
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
  sponsors: [
    {
      type: String, // Her bir sponsor bir string olacak
    },
  ],
  currentphase: {
    type: String,
    default: 'none'
  }
}, {
  timestamps: true,
});

const Tournament = models.Tournament || model<TournamentDocument>('Tournament', TournamentSchema);
export default Tournament;
