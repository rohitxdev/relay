import { Router } from 'express';
import { rootController } from '../controllers/root.js';
import { getAgoraAccessTokenController } from '../controllers/get-agora-access-token.js';
import { getRoomIdController } from '../controllers/get-room-id.js';
import { getUsernameController } from '../controllers/get-username.js';
import { verifyRoomIdController } from '../controllers/verify-room-id.js';
import { authMiddleware } from '../middlewares/auth.js';
import { changeUsernameController } from '../controllers/change-username.js';

export const serviceRouter = Router();

// serviceRouter.use(authMiddleware);
serviceRouter.get('/', rootController);
serviceRouter.get('/get-room-id', getRoomIdController);
serviceRouter.get('/verify-room-id/:roomId', verifyRoomIdController);
serviceRouter.get('/get-agora-access-token', getAgoraAccessTokenController);
serviceRouter.get('/get-username/:uid', getUsernameController);
serviceRouter.put('/change-username', changeUsernameController);
serviceRouter.put('/change-password');
