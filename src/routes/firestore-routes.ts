import { Request, Response, Router } from "express";
import firestoreService from "../services/firestore-service";

const router = Router();

router.get(
	"/scorers/:seasonId/:leagueId",
	async (req: Request, res: Response) => {
		const { seasonId, leagueId } = req.params;

		try {
			const response = await firestoreService.getTopScorers(
				Number(seasonId),
				Number(leagueId)
			);
			res.status(200).send(response);
		} catch (error) {
			res.status(500).send(error);
		}
	}
);

router.get("/leagues/:leagueId", async (req: Request, res: Response) => {
	const { leagueId } = req.params;

	try {
		const response = await firestoreService.getSeasons(Number(leagueId));
		res.status(200).send(response);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.put("/stats", async (res: Response) => {
	try {
		await firestoreService.updateLatestSeason();
		res.status(200).send("Updated successfully");
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;
