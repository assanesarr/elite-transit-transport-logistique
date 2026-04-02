import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
//import { saltAndHashPassword } from "@/utils/password"
// import { cookies } from "next/headers";

import { adminDb } from "@/lib/firebase-admin";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // credentials: {
      //   email: {},
      //   password: {},
      // },
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {

        console.log("Received credentials:", credentials);
        // logic to salt and hash password
        const pwHash = credentials.password //saltAndHashPassword(credentials.password)
        const usersRef = adminDb.collection("users");

        const q = usersRef.where("email", "==", credentials.identifier);
        const snapshot = await q.get();
        if (snapshot.empty) {
          return null;
          //  throw new Error("Invalid ! credentials.");
        }

        if (pwHash !== snapshot.docs[0].data().password) {
          return null;
          // throw new Error("Invalid !!! credentials.")
        }
        const user = snapshot.docs[0].data();

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          // throw new Error("Invalid credentials.")
          return null;
        }
        return user
      }
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const dbUser = await adminDb.collection("users").where("email", "==", user.email).get().then(snapshot => {
        if (snapshot.empty) {
          return null
        }
        return snapshot.docs[0].data()
      })

      if (!dbUser) {
        throw new Error("User not found") // ❌ causes CallbackRouteError
      }

      return true
    }
    // async session({ session, token }) {
    //   if (token) {
    //     session.user.id = token.id;
    //     session.user.email = token.email;
    //   }
    //   return session;
    // },
  },
})