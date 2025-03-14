import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import firestoreService from "../services/firestore-service";

const router = Router();

router.get(
	"/health",
	asyncHandler(async (req: Request, res: Response) => {
		res.sendStatus(200);
	})
);

router.get(
	"/scorers/:seasonId/:leagueId",
	asyncHandler(async (req: Request, res: Response) => {
		const { seasonId, leagueId } = req.params;
		const response = await firestoreService.getTopScorers(
			Number(seasonId),
			Number(leagueId)
		);
		res.status(200).json(response);
	})
);

router.get(
	"/seasons/:leagueId",
	asyncHandler(async (req: Request, res: Response) => {
		const { leagueId } = req.params;
		const response = await firestoreService.getSeasons(Number(leagueId));
		res.status(200).json(response);
	})
);

router.put(
	"/stats",
	asyncHandler(async (req: Request, res: Response) => {
		await firestoreService.updateLatestSeason();
		res.sendStatus(200);
	})
);

export default router;
