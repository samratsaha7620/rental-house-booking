"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleWare_1 = require("./authMiddleWare");
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
router.get('/', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthenticated' });
        }
        const user = yield db_1.default.user.findUnique({
            where: { id: userId },
            select: { favoriteIds: true },
        });
        if (!user || !user.favoriteIds.length) {
            return [];
        }
        const favoriteListings = yield db_1.default.listing.findMany({
            where: {
                id: {
                    in: user.favoriteIds,
                },
            },
        });
        return res.status(200).json(favoriteListings);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.post('/like', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthenticated' });
        }
        const { listingId } = req.body;
        if (!listingId || typeof listingId !== 'string') {
            return res.status(400).json({ error: 'Invalid Listing ID' });
        }
        const user = yield db_1.default.user.findUnique({
            where: { id: userId },
            select: { favoriteIds: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        let favoriteIds = [...(user.favoriteIds || [])];
        const isAlreadyLiked = favoriteIds.find((id) => id === listingId);
        if (isAlreadyLiked) {
            return res.status(402).json({ message: "Not allowed to like more than once" });
        }
        favoriteIds.push(listingId);
        const updateUser = yield db_1.default.user.update({
            where: {
                id: userId
            },
            data: {
                favoriteIds
            }
        });
        return res.status(200).json(favoriteIds);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.post('/unlike', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthenticated' });
        }
        const { listingId } = req.body;
        if (!listingId || typeof listingId !== 'string') {
            return res.status(400).json({ error: 'Invalid Listing ID' });
        }
        const user = yield db_1.default.user.findUnique({
            where: { id: userId },
            select: { favoriteIds: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        let favoriteIds = [...(user.favoriteIds || [])];
        favoriteIds = favoriteIds.filter((id) => id !== listingId);
        const updateUser = yield db_1.default.user.update({
            where: {
                id: userId
            },
            data: {
                favoriteIds
            }
        });
        return res.status(200).json(favoriteIds);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
