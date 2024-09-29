import mongoose from "mongoose";

const categoryEnum = [
    "Groceries",
    "Transportation",
    "Restaurants",
    "Alcohol",
    "Loan Payments",
    "Bank Fees",
    "Entertainment",
    "Shopping",
    "Home",
    "Medical",
    "Personal Care",
    "Education",
    "Insurance",
    "General Services",
    "Taxes",
    "Travel",
    "Rent and Utilities",
    "Savings",
    "Other",
]

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: categoryEnum,
        required: true,
        default: "Other"
    },
    amount: {
        type:Number,
        required: true,
        default: 0
    },
    progress: {
        type: Number,
        required: true,
        default: 0
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
        type: String
    },
    monthlyIncome: {
        type: Number,
        required: true
    },
    budgets: [budgetSchema],
    experience: {
        type: Number,
        default: 0
    },
    goals: {
        type: [String],
        default: []
    }
});

const User = mongoose.model("User", userSchema);
export default User;