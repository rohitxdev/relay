import { RequestHandler } from 'express';

export const rootController: RequestHandler = (req, res) => {
	res.send('*Cricket sounds*');
};
