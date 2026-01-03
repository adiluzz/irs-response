import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('=== AUTHORIZE CALLED ===');
        console.log('Credentials received:', { email: credentials?.email, hasPassword: !!credentials?.password });
        
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }

          console.log('Connecting to database...');
          await connectDB();
          console.log('Database connected');

          // Normalize email to lowercase and trim
          const normalizedEmail = credentials.email.toLowerCase().trim();
          console.log('Looking up user with email:', normalizedEmail);
          
          const user = await User.findOne({ email: normalizedEmail }).select('+password');

          if (!user) {
            console.log('Login attempt: User not found for email:', normalizedEmail);
            return null;
          }

          console.log('User found:', { id: user._id, email: user.email, emailVerified: user.emailVerified });

          if (!user.emailVerified) {
            console.log('Login attempt: Email not verified for:', normalizedEmail);
            // Throw error for verification so it shows up in the UI
            throw new Error('Please verify your email address before logging in');
          }

          console.log('Comparing password...');
          const isPasswordValid = await user.comparePassword(credentials.password);
          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Login attempt: Invalid password for:', normalizedEmail);
            return null;
          }

          console.log('Login successful for:', normalizedEmail);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email,
          };
        } catch (error: any) {
          console.error('Authorization error:', error);
          // Re-throw verification errors so they show up properly
          if (error.message && error.message.includes('verify')) {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
