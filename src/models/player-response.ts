import type Player from "./player";

export default interface PlayerResponse {
	get: string;
	parameters: {};
	errors: [];
	results: number;
	paging: {};
	response: Player[];
}
