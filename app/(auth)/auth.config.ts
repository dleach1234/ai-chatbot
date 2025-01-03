import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith('/');
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnPricing = nextUrl.pathname.startsWith('/pricing');
      const isOnStripeApi = nextUrl.pathname.startsWith('/api/stripe');
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      // Allow public access to pricing page
      if (isOnPricing) {
        return true;
      }

      // Allow Stripe webhook calls
      if (isOnStripeApi && nextUrl.pathname.includes('/webhook')) {
        return true;
      }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      if (isOnRegister || isOnLogin) {
        return true;
      }

      // Protect dashboard route
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isOnChat) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
