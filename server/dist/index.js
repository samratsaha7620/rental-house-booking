"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const listing_1 = __importDefault(require("./routes/listing"));
const generateUrl_1 = __importDefault(require("./routes/generateUrl"));
const reservations_1 = __importDefault(require("./routes/reservations"));
const favourites_1 = __importDefault(require("./routes/favourites"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/listings', listing_1.default);
app.use('/api/v1/favourites', favourites_1.default);
app.use('/api/v1/img', generateUrl_1.default);
app.use('/api/v1/reservations', reservations_1.default);
app.get('/', (req, res) => {
    res.send("Health is ok");
});
app.listen(PORT, () => {
    console.log(`Server Running On Port:${PORT}`);
});
