import mongoose , {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

interface Iuser {
    username : string ;
    email : string ;
    password : string ;
    id?: mongoose.Types.ObjectId ;
    createdAt ?: Date ;
    modifiedAt ?: Date ;
}

const UserSchema = new Schema<Iuser>(
    {
    username : {type :"String",  required : true , unique: true },
    email : {type :"String",  required : true , unique: true },
    password : {type :"String",  required : true , },
    },
    {
        timestamps: true,
    }
)

UserSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
    }
    next();
} );

const User = models?.User || model<Iuser>("User" , UserSchema); 

export default User 