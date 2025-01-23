import { NextRequest } from 'next/server';
import { POST } from '../../app/api/auth/login/route';
import User from '../../schema/userModule';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Mock dependencies
jest.mock('../../schema/userModule');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../dbconfig/dbconfig', () => ({
  connect: jest.fn()
}));

describe('Login API Route', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up environment variable
    process.env.TOKEN_SECRET = 'test_secret';
  });

  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword'
  };

  it('should successfully login with email', async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    
    // Mock password comparison to return true
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
    
    // Mock JWT sign
    (jwt.sign as jest.Mock).mockReturnValue('mock_token');

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: 'test@example.com',
        password: 'correctpassword'
      })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Login successful');
    expect(responseBody.success).toBe(true);
  });

  it('should successfully login with username', async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    
    // Mock password comparison to return true
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
    
    // Mock JWT sign
    (jwt.sign as jest.Mock).mockReturnValue('mock_token');

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: 'testuser',
        password: 'correctpassword'
      })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Login successful');
    expect(responseBody.success).toBe(true);
  });

  it('should return error for non-existent user', async () => {
    // Mock User.findOne to return null
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: 'nonexistent@example.com',
        password: 'anypassword'
      })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('User does not exist');
  });

  it('should return error for invalid password', async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    
    // Mock password comparison to return false
    (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: 'test@example.com',
        password: 'wrongpassword'
      })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('Invalid password');
  });

  it('should handle unexpected errors', async () => {
    // Mock User.findOne to throw an error
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        emailOrUsername: 'test@example.com',
        password: 'anypassword'
      })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(500);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('Database error');
  });
});