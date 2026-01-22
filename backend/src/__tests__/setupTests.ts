process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://user:password@localhost:5432/rbac_admin_test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-123456789012345678901234567890";
process.env.INVITE_EXPIRY_HOURS = process.env.INVITE_EXPIRY_HOURS ?? "24";
