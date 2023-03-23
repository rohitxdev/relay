import { RequestHandler } from 'express';
import { rooms } from '../models/mongodb.js';

export const verifyRoomIdController: RequestHandler = async (req, res) => {
	const { roomId } = req.params;
	try {
		const data = await rooms.findOne({ room_id: roomId });
		if (data?.room_id) {
			res.sendStatus(200);
		} else {
			res.sendStatus(400);
		}
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
};
