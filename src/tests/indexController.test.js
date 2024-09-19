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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Index Route Tests', () => {
    it('should return hotel name and available endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/');
        expect(res.status).toBe(200);
        expect(res.body.hotelName).toBe('Hotel Miranda');
        expect(res.body.availableEndpoints).toBeDefined();
        expect(Array.isArray(res.body.availableEndpoints)).toBe(true);
    }));
});
describe('Protected Routes Tests', () => {
    const protectedRoutes = [
        { path: '/api/rooms', method: 'get' },
        { path: '/api/bookings', method: 'get' },
        { path: '/api/contacts', method: 'get' },
        { path: '/api/users', method: 'get' },
    ];
    protectedRoutes.forEach((route) => {
        it(`should return 401 for ${route.method.toUpperCase()} ${route.path} without token`, () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)[route.method](route.path);
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        }));
    });
    it('should return 200 and data for GET /api/rooms with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post('/api/login').send({
            username: 'admin',
            password: 'admin',
        });
        const token = loginResponse.body.token;
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/rooms')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
});
