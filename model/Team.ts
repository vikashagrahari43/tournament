import mongoose, {Schema , Document, model, models } from "mongoose";

interface ITeamMember {
    name : string ;
    bgmiId: number ;
    role : string ; 
}

interface Iteam extends Document {
    owner : mongoose.Types.ObjectId;
    name : string, 
    members : ITeamMember[];
    teamid ?: string;
    createdby ?: string;
}

const teamMemberSchema = new Schema<ITeamMember>({
    name : {type : String , required : true },
    bgmiId : {type : Number, required : true, unique : true},
    role: {type : String, required : true},
})

const TeamSchema = new Schema<Iteam>({
    owner: {type : Schema.Types.ObjectId, required : true, unique: true ,  ref: "User"},
    name : { type : String, required: true,},
    members: {
        type : [teamMemberSchema], 
        validate : {
            validator : function (members : ITeamMember[]) {
                return members.length >= 4 && members.length <=6
            },
            message : "A team must have at least 4 and at most 6 members.",
        }
    },
    teamid : {type : String, unique : true, sparse: true},
    createdby : {type : String},
});

const Team = models?.Team || model<Iteam>("Team" , TeamSchema); 

export default Team