import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import { error } from "@/lib/apiResponse";
import bcrypt from "bcryptjs";

const adminRoles = ["ADMIN", "MANAGER"];

/** Find or create a customer user for OAuth sign-in (e.g. Google). */
async function findOrCreateOAuthUser(email, name) {
  await connectDB();
  let user = await User.findOne({ email }).lean();
  if (user) return { id: user._id.toString(), role: user.role };
  const newUser = await User.create({
    email,
    fullName: name || email,
    role: "USER",
    status: "ACTIVE",
  });
  return { id: newUser._id.toString(), role: newUser.role };
}

export const { handlers, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email })
            .select("+password")
            .lean();
          if (!user?.password) return null;
          const ok = await bcrypt.compare(
            String(credentials.password),
            user.password
          );
          if (!ok) return null;
          if (user.status !== "ACTIVE") return null;
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fullName || user.email,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const dbUser = await findOrCreateOAuthUser(user.email, user.name);
          token.userId = dbUser.id;
          token.role = dbUser.role;
          token.email = user.email;
        } else {
          token.userId = user.id;
          token.role = user.role;
          token.email = user.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.email = token.email || session.user.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
});

export async function getServerSession() {
  return auth();
}

export function requireAuth(handler) {
  return async (req, context) => {
    const session = await auth();
    if (!session?.user) {
      return error("Unauthorized", 401, "UNAUTHORIZED");
    }
    return handler(req, context, session);
  };
}

export function requireAdmin(handler) {
  return async (req, context) => {
    const session = await auth();
    if (!session?.user) {
      return error("Unauthorized", 401, "UNAUTHORIZED");
    }
    if (!adminRoles.includes(session.user.role)) {
      return error("Forbidden", 403, "FORBIDDEN");
    }
    return handler(req, context, session);
  };
}
