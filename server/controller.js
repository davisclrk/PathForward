import User from "./models/user.js";

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, monthlyIncome, budgets } = req.body;

        if (!firstName || !lastName || !email || !password || !monthlyIncome || !budgets) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const userExists = await User.exists({ email: email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists!" });
        }

        const user = await User.create({ firstName, lastName, email, password, monthlyIncome, budgets });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

