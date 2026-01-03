import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { sendVerificationEmail } from '@/lib/email/emailService';
import crypto from 'crypto';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours

    // Create user
    const user = new User({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, user.name);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email fails, but log it
    }

    return NextResponse.json(
      {
        message: 'User created successfully. Please check your email to verify your account.',
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
