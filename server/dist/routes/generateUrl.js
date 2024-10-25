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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const authMiddleWare_1 = require("./authMiddleWare");
const router = (0, express_1.Router)();
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    region: process.env.AWS_DEFAULT_REGION,
});
router.post('/generate-presigned-url', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { imageName, imageType } = req.body;
    //@ts-ignore
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        return res.status(401).send({ message: "Unauthenticated" });
    }
    const allowedImageTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
    ];
    if (!allowedImageTypes.includes(imageType)) {
        return res.status(404).send({ error: "Unsupported Image Type" });
    }
    try {
        const input = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            ContentType: imageType,
            Key: `/uploads/${userId}/tweets/${imageName}-${Date.now()}`,
        };
        const putObjectCommand = new client_s3_1.PutObjectCommand(input);
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand);
        return res.status(200).json({ getSignedURLForListing: signedUrl });
    }
    catch (error) {
        console.error("Error generating presigned URL:", error);
        return res.status(500).json({ error: "Failed to generate presigned URL" });
    }
}));
exports.default = router;
