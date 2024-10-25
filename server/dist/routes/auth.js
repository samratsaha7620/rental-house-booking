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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const authMiddleWare_1 = require("./authMiddleWare");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_jwt";
const router = express_1.default.Router();
// const prisma = new PrismaClient();
//User signup route
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    try {
        const existingUser = yield db_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists.." });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        const user = yield db_1.default.user.create({
            data: {
                name,
                email,
                hashedPassword,
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        return res.status(201).json({ user, token });
    }
    catch (error) {
        return res.status(500).json({ error: "Something went wrong." });
    }
}));
//User signin Route
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const user = yield db_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password. " });
        }
        const isPasswordValid = user.hashedPassword && (yield bcrypt_1.default.compare(password, user.hashedPassword.toString()));
        if (!user.hashedPassword || !isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ user, token });
    }
    catch (error) {
        return res.status(500).json({ error: 'Something went wrong.' });
    }
}));
//get current User route
router.get('/current-user', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        //@ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(404).json({ message: 'User not Found' });
        }
        const currentUser = yield db_1.default.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(Object.assign(Object.assign({}, currentUser), { createdAt: currentUser.createdAt.toISOString(), updatedAt: currentUser.updatedAt.toISOString(), emailVerified: ((_b = currentUser.emailVerified) === null || _b === void 0 ? void 0 : _b.toISOString()) || null }));
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
