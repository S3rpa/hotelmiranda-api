import request from 'supertest'
import app from '../app'

describe('Index Route Tests', () => {
    it('should return hotel name and available endpoints', async () => {
        const res = await request(app).get('/')

        expect(res.status).toBe(200)
        expect(res.body.hotelName).toBe('Hotel Miranda')
        expect(res.body.availableEndpoints).toBeDefined()
        expect(Array.isArray(res.body.availableEndpoints)).toBe(true)
    })
})

describe('Protected Routes Tests', () => {
    const protectedRoutes = [
        { path: '/api/rooms', method: 'get' },
        { path: '/api/bookings', method: 'get' },
        { path: '/api/contacts', method: 'get' },
        { path: '/api/users', method: 'get' },
    ]

    protectedRoutes.forEach((route) => {
        it(`should return 401 for ${route.method.toUpperCase()} ${route.path} without token`, async () => {
            const res = await (request(app) as any)[route.method](route.path)

            expect(res.status).toBe(401)
            expect(res.body.message).toBe('Access denied. No token provided.')
        })
    })

    it('should return 200 and data for GET /api/rooms with valid token', async () => {
        const loginResponse = await request(app).post('/api/login').send({
            username: 'admin',
            password: 'admin',
        })

        const token = loginResponse.body.token

        const res = await request(app)
            .get('/api/rooms')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
})
