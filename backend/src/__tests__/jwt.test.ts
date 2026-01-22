import { describe, it, expect, vi, beforeAll } from "vitest";
import jwt from "jsonwebtoken";

// Mock the JWT secret for testing
const TEST_SECRET = "test-secret-key-for-testing";

describe("JWT Utils", () => {
    it("should sign and verify a token with jwt library", () => {
        const payload = { userId: "test-user-id", role: "ADMIN" as const };
        const token = jwt.sign(payload, TEST_SECRET, { expiresIn: "8h" });

        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
        expect(token.split(".")).toHaveLength(3); // JWT format

        const decoded = jwt.verify(token, TEST_SECRET) as typeof payload;
        expect(decoded).toBeDefined();
        expect(decoded.userId).toBe(payload.userId);
        expect(decoded.role).toBe(payload.role);
    });

    it("should reject invalid tokens", () => {
        expect(() => jwt.verify("invalid.token.here", TEST_SECRET)).toThrow();
    });

    it("should reject tokens signed with wrong secret", () => {
        const payload = { userId: "test-user-id", role: "ADMIN" as const };
        const token = jwt.sign(payload, "wrong-secret");

        expect(() => jwt.verify(token, TEST_SECRET)).toThrow();
    });
});
