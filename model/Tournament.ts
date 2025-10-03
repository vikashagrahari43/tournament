// models/Tournament.ts
import mongoose, { Schema, Document, model, models } from "mongoose";

interface Iparticipants {
  teamId: string;
  teamName: string;
  joinedAt: Date;
  OwnerEmail: string;
  Matchpoints?: Number;
}

export interface ITournament extends Document {
  
  title: string;
  slogan: string;
  prizePool: number;
  entryFee: number;
  maxTeams: number;
  enrolledTeams?: number;
  date: Date;   
  time: string; 
  status?: "registering" | "completed" | "full";
  participants?: Iparticipants[] | null;
  RoomId?: string | null; 
  RoomPass?: string | null;
}

const participantsSchema = new Schema<Iparticipants>(
  {
    teamName: { type: String, required: true },
    teamId: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
    OwnerEmail: { type: String, required: true },  
    Matchpoints: { type: Number, default: 0 },
  }
);


const tournamentSchema = new Schema<ITournament>(
  {
    title: { type: String, required: true },
    slogan: { type: String },
    prizePool: { type: Number, required: true },
    entryFee: { type: Number, required: true },
    maxTeams: { type: Number, required: true },
    enrolledTeams: { type: Number, default: 0 },
    
    
    date: { type: Date, required: true }, 
    time: { type: String, required: true },

    status: {
      type: String,
      enum: ["registering", "completed" , "full"],
      default: "registering",
    },
    
    participants: [participantsSchema],
    RoomId: { type: String, default: null },  
    RoomPass: { type: String, default: null },
  },
  { timestamps: true }
);

const Tournament = models.Tournament || model<ITournament>("Tournament", tournamentSchema);

export default Tournament;
