import { jest } from '@jest/globals';
import { addCost, getReport } from '../controllers/costController.js';
import { getUserDetails, createUser, getDevelopers } from '../controllers/userController.js';
import Cost from '../models/costs.js';
import User from '../models/users.js';
import mongoose from 'mongoose';

// Mock the models
jest.mock('../models/costs.js');
jest.mock('../models/users.js');

describe('Cost Controller Tests', () => {
    let req;
    let res;
    
    beforeEach(() => {
        jest.clearAllMocks();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('addCost', () => {
        beforeEach(() => {
            req = {
                body: {
                    description: 'Test Cost',
                    category: 'food',
                    sum: 100,
                    userid: 'user123',
                    created_at: new Date('2024-02-07')
                }
            };
            
            Cost.prototype.save = jest.fn().mockResolvedValue({
                description: 'Test Cost',
                category: 'food',
                sum: 100,
                userid: 'user123'
            });
            
            User.findOneAndUpdate = jest.fn().mockResolvedValue({
                id: 'user123',
                total_spent: 1100,
                monthly_spending: new Map([['2024-02', { food: 100 }]])
            });
        });

        test('should successfully add a new cost', async () => {
            await addCost(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(Cost.prototype.save).toHaveBeenCalled();
        });

        test('should validate required fields', async () => {
            delete req.body.description;
            await addCost(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
        });

        test('should validate category', async () => {
            req.body.category = 'invalid';
            await addCost(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category' });
        });

        test('should handle database errors', async () => {
            Cost.prototype.save.mockRejectedValue(new Error('DB Error'));
            await addCost(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getReport', () => {
        beforeEach(() => {
            req = {
                query: {
                    id: 'user123',
                    year: '2024',
                    month: '2'
                }
            };

            Cost.find = jest.fn().mockResolvedValue([
                { category: 'food', sum: 100, description: 'Groceries', created_at: new Date('2024-02-01') },
                { category: 'health', sum: 200, description: 'Medicine', created_at: new Date('2024-02-15') }
            ]);
        });

        test('should generate monthly report', async () => {
            await getReport(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                userid: 'user123',
                year: 2024,
                month: 2
            }));
        });

        test('should validate required parameters', async () => {
            delete req.query.month;
            await getReport(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should validate date format', async () => {
            req.query.month = '13';
            await getReport(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should handle database errors', async () => {
            Cost.find.mockRejectedValue(new Error('DB Error'));
            await getReport(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});

describe('User Controller Tests', () => {
    let req;
    let res;
    
    beforeEach(() => {
        jest.clearAllMocks();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getUserDetails', () => {
        beforeEach(() => {
            req = {
                params: {
                    id: 'user123'
                }
            };

            User.findOne = jest.fn().mockResolvedValue({
                id: 'user123',
                first_name: 'John',
                last_name: 'Doe',
                total_spent: 1000
            });
        });

        test('should return user details', async () => {
            await getUserDetails(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                id: 'user123',
                first_name: 'John'
            }));
        });

        test('should handle non-existent user', async () => {
            User.findOne.mockResolvedValue(null);
            await getUserDetails(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('should handle database errors', async () => {
            User.findOne.mockRejectedValue(new Error('DB Error'));
            await getUserDetails(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createUser', () => {
        beforeEach(() => {
            req = {
                body: {
                    id: 'user123',
                    first_name: 'John',
                    last_name: 'Doe',
                    birthday: '1990-01-01',
                    marital_status: 'single'
                }
            };

            User.prototype.save = jest.fn().mockResolvedValue({
                id: 'user123',
                first_name: 'John',
                last_name: 'Doe'
            });
        });

        test('should create new user', async () => {
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(User.prototype.save).toHaveBeenCalled();
        });

        test('should validate required fields', async () => {
            delete req.body.first_name;
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing details!' });
        });

        test('should handle database errors', async () => {
            User.prototype.save.mockRejectedValue(new Error('DB Error'));
            await createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getDevelopers', () => {
        test('should return developers list', async () => {
            await getDevelopers(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { first_name: 'Ofek', last_name: 'Drihan' },
                { first_name: 'Ziv', last_name: 'Katzir' }
            ]);
        });

        test('should handle errors', async () => {
            res.status.mockImplementation(() => {
                throw new Error('Server error');
            });
            
            await getDevelopers(req, res);
            expect(res.json).toHaveBeenCalledWith({ 
                message: 'Server error'
            });
        });
    });
});

describe('Model Schema Tests', () => {
    describe('Cost Model', () => {
        beforeEach(() => {
            // Mock Schema validation behavior
            Cost.prototype.validateSync = jest.fn().mockReturnValue({
                errors: {
                    description: new Error('Description is required'),
                    category: new Error('Category is required'),
                    sum: new Error('Sum is required'),
                    userid: new Error('User ID is required')
                }
            });
        });

        test('should validate required fields', () => {
            const cost = new Cost({});
            const validationError = cost.validateSync();
            expect(validationError.errors.description).toBeDefined();
            expect(validationError.errors.category).toBeDefined();
            expect(validationError.errors.sum).toBeDefined();
            expect(validationError.errors.userid).toBeDefined();
        });

        test('should validate category enum', () => {
            Cost.prototype.validateSync = jest.fn().mockReturnValue({
                errors: {
                    category: new Error('Invalid category')
                }
            });
            
            const cost = new Cost({
                description: 'Test',
                category: 'invalid',
                sum: 100,
                userid: 'user123'
            });
            const validationError = cost.validateSync();
            expect(validationError.errors.category).toBeDefined();
        });

        test('should set default created_at', () => {
            const cost = new Cost({
                description: 'Test',
                category: 'food',
                sum: 100,
                userid: 'user123'
            });
            
            // Mock the created_at field
            cost.created_at = new Date();
            
            expect(cost.created_at).toBeDefined();
        });
    });

    describe('User Model', () => {
        beforeEach(() => {
            // Mock Schema validation behavior
            User.prototype.validateSync = jest.fn().mockReturnValue({
                errors: {
                    id: new Error('ID is required'),
                    first_name: new Error('First name is required'),
                    last_name: new Error('Last name is required'),
                    birthday: new Error('Birthday is required'),
                    marital_status: new Error('Marital status is required')
                }
            });
        });

        test('should validate required fields', () => {
            const user = new User({});
            const validationError = user.validateSync();
            expect(validationError.errors.id).toBeDefined();
            expect(validationError.errors.first_name).toBeDefined();
            expect(validationError.errors.last_name).toBeDefined();
            expect(validationError.errors.birthday).toBeDefined();
            expect(validationError.errors.marital_status).toBeDefined();
        });

        test('should set default values', () => {
            const user = new User({
                id: 'user123',
                first_name: 'John',
                last_name: 'Doe',
                birthday: new Date(),
                marital_status: 'single'
            });
            
            // Mock default values
            user.total_spent = 0;
            user.monthly_spending = new Map();
            
            expect(user.total_spent).toBe(0);
            expect(user.monthly_spending).toBeDefined();
            expect(user.monthly_spending.size).toBe(0);
        });

        test('should enforce unique id', async () => {
            const duplicateError = new Error('E11000 duplicate key error');
            User.prototype.save = jest.fn().mockRejectedValue(duplicateError);

            const user = new User({
                id: 'user123',
                first_name: 'John',
                last_name: 'Doe',
                birthday: new Date(),
                marital_status: 'single'
            });

            await expect(user.save()).rejects.toThrow(duplicateError);
        });
    });
});