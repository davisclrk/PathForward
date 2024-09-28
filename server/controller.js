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