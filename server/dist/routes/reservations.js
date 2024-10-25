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
const express_1 = require("express");
const authMiddleWare_1 = require("./authMiddleWare");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
//get a resrvation by listingId , userId and authorId
router.get("/:listingId?/:userId?/:authorId?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listingId, userId, authorId } = req.params;
        const query = {};
        if (listingId) {
            query.listingId = listingId;
        }
        ;
        if (userId) {
            query.userId = userId;
        }
        if (authorId) {
            query.listing = { userId: authorId };
        }
        const reservations = yield db_1.default.reservations.findMany({
            where: query,
            include: {
                listing: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.status(200).json(reservations);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
//book a reservation
router.post("/reserve", authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const currentUserId = req.user.userId;
        if (!currentUserId) {
            return res.status(401).json({ error: 'Unauthenticated' });
        }
        const { listingId, startDate, endDate, totalPrice } = req.body;
        if (!listingId || !startDate || !endDate || !totalPrice) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const listingAndReservation = yield db_1.default.listing.update({
            where: {
                id: listingId
            },
            data: {
                reservations: {
                    create: {
                        userId: currentUserId,
                        startDate,
                        endDate,
                        totalPrice,
                    }
                }
            }
        });
        return res.status(200).json(listingAndReservation);
    }
    catch (error) {
        console.error('Error creating reservation:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
//cancel a resrvation
router.delete("/:id", authMiddleWare_1.authenticationMiddleWare, (req, res) => {
    const { id } = req.params;
    return res.status(200).json("deleted");
});
exports.default = router;
