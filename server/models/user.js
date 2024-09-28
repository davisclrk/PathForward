import mongoose from "mongoose";

const categoryEnum = [
    "Groceries",
    "Transportation",
    "Loan Payments",
    "Bank Fees",
    "Entertainment"
]

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: categoryEnum,
        required: true
    },
    amount: {
        type:Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        required: true
    },
});

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    plaidAccessToken: {
        type: String
    },
    plaidItemID: {
        type: String,
    },
    monthlyIncome: {
        type: Number,
        required: true
    },
    budgets: [budgetSchema]
});

const User = mongoose.model("User", userSchema);
export default User;