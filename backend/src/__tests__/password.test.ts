import { describe, it, expect, vi, beforeEach } from "vitest";
import { hashPassword, verifyPassword } from "../utils/password.js";

describe("Password Utils", () => {
    it("should hash a password", async () => {
        const password = "SecurePass123!";
        const hashed = await hashPassword(password);

        expect(hashed).toBeDefined();
        expect(hashed).not.toBe(password);
        expect(hashed.length).toBeGreaterThan(20);
    });

    it("should verify a correct password", async () => {
        const password = "SecurePass123!";
        const hashed = await hashPassword(password);

        const isValid = await verifyPassword(password, hashed);
        expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
        const password = "SecurePass123!";
        const wrongPassword = "WrongPass456!";
        const hashed = await hashPassword(password);

        const isValid = await verifyPassword(wrongPassword, hashed);
        expect(isValid).toBe(false);
    });
});
