import axios, { CreateAxiosDefaults } from "axios";
import { config } from "dotenv";

config();

const configAPI: CreateAxiosDefaults = {
	baseURL: "https://v3.football.api-sports.io/",
	headers: {
		Accept: "application/json; charset=utf-8",
		"Content-Type": "application/json; charset=utf-8",
		"x-apisports-key": process.env.X_APISPORTS_KEY,
	},
};

export default axios.create(configAPI);
