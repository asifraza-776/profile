import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import connectDB from '@/db/connectDB';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        
        // Check if user exists
        let dbUser = await User.findOne({ email: user.email });
        
        if (!dbUser) {
          // Create new user if doesn't exist
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            username: user.email.split('@')[0],
            profilepic: user.image,
          });
        }
        
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false; // Deny sign in if database fails
      }
    },
    async session({ session, token }) {
      try {
        await connectDB();
        
        // Get user from database
        const dbUser = await User.findOne({ email: session.user.email });
        
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.username = dbUser.username;
        }
        
        return session;
      } catch (error) {
        console.error('Session error:', error);
        return session; // Return session even if DB fails
      }
    },
    async jwt({ token, user }) {
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Add debug mode temporarily to see errors
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };