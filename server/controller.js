import User from "./models/user.js";
import dotenv from "dotenv";
import { Configuration, PlaidApi, Products, PlaidEnvironments } from "plaid";

dotenv.config();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = 'sandbox';
const PLAID_PRODUCTS = process.env.PLAID_PRODUCTS;
const PLAID_COUNTRY_CODES = process.env.PLAID_COUNTRY_CODES;

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
export const logIn = async(req, res) => {
    try {
        const {email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  });

const client = new PlaidApi(configuration);

export const getInfo = async (req, res, next) => {
    res.json({
      item_id: ITEM_ID,
      access_token: ACCESS_TOKEN,
      products: PLAID_PRODUCTS,
    });
  };

export const createLinkToken = async (req, res, next) => {
    try {
        const configs = {
          user: {
            client_user_id: req.body.userId,
          },
          client_name: 'Plaid Connection',
          products: PLAID_PRODUCTS.split(','),
          country_codes: PLAID_COUNTRY_CODES.split(','),
          language: 'en',
        };
    
        const createTokenResponse = await client.linkTokenCreate(configs);
        res.json(createTokenResponse.data);
      } catch (error) {
        console.error('Error creating link token:', error.response ? error.response.data : error.message);
        res.status(400).json({ error: 'Failed to create link token' });
      }
};

/**
 * Exchange the public token for an access token. The key for the public token should be `public_token`. Req must contain
 * key for the user's id, 'userId'.
 */
export const createAccessToken = async(req, res, next) => {
  try {
    const response = await client.itemPublicTokenExchange({
      public_token:req.body.public_token
    });
    access_token = response.data.access_token;
    item = response.data.item;
    response.json({
      // the 'access_token' is a private token, DO NOT pass this token to the frontend in your production environment
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    });
    const user = await User.findOne({_id: req.body.userId});
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.plaidAccessToken = ACCESS_TOKEN;
    user.plaidItemID = ITEM_ID;
    await user.save();
  } catch (error) {
    console.error('Error creating access token:', error.response ? error.response.data : error.message);
    res.status(400).json({ error: 'Failed to create access token' });
  }
};

