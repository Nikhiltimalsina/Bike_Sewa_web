"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongodb_1 = __importDefault(require("../database/mongodb"));
const user_route_1 = __importDefault(require("../routes/user.route"));
const http_exception_1 = require("../exceptions/http-exception");
const constant_1 = require("../configs/constant");
const app = (0, express_1.default)();
// ── Middlewares ──────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: constant_1.CORS_ORIGINS,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ── Routes ───────────────────────────────────────────────────
app.use("/auth", user_route_1.default);
// Health check
app.get("/", (_req, res) => {
    res.json({ message: "🚲 Bike Sewa API is running" });
});
// ── Global Error Handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
    if (err instanceof http_exception_1.HttpException) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("Unexpected error:", err);
    return res.status(500).json({ message: "Internal server error" });
});
// ── Start ────────────────────────────────────────────────────
(0, mongodb_1.default)().then(() => {
    app.listen(constant_1.PORT, () => {
        console.log(`🚲 Bike Sewa Backend running on http://localhost:${constant_1.PORT}`);
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map