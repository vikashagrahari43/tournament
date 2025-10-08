import mongoose, {Schema, model, models, Document} from "mongoose";

export interface ITransaction {
    _id?: mongoose.Types.ObjectId;
    type: "add" | "withdraw" | "tournament";
    amount: number;
    status: "pending" | "completed" | "failed";
    description?: string;
    screenshotUrl?: string;
    date: Date;
    userEmail?: string;
   
}
export interface IWallet extends Document {
    email: string;
    userId : mongoose.Types.ObjectId ;
    balance : number ;
    upiId?: string;
    transactions: ITransaction[]
}

const TransactionSchema = new Schema<ITransaction>(
    {
        type: {type : String, enum: ["add", "withdraw", "tournament"], required: true},
        amount: {type: Number, required: true},
        status: {type : String, enum: ["pending", "completed" , "failed"], default: "pending"},
        description: {type: String},
        screenshotUrl: {type: String},
        date: {type: Date, default: Date.now},
        userEmail: {type: String,},
    },
    {_id: true}
);

const WalletSchema = new Schema<IWallet>({
    email: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, required: true, unique: true, ref: "User"},
    balance: {type: Number, default: 0},
    upiId: {type: String, required: false},
    transactions: {type: [TransactionSchema], default: []}
});


const Wallet = models?.Wallet || model<IWallet>("Wallet", WalletSchema);

export default Wallet;