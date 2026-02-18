export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "developer" | "admin" | "personnel" | "user";
    };
  }
}