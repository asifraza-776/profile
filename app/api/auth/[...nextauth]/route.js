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
    // Add other providers as needed
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();
      
      // Check if user exists
      let dbUser = await User.findOne({ email: user.email });
      
      if (!dbUser) {
        // Create new user if doesn't exist
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          username: user.email.split('@')[0], // Generate username from email
          profilepic: user.image,
        });
      }
      
      return true;
    },
    async session({ session, token }) {
      await connectDB();
      
      // Get user from database
      const dbUser = await User.findOne({ email: session.user.email });
      
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.username = dbUser.username;
      }
      
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Error page redirect
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };