import request from "supertest";
import app from "../app";

describe("Admin API Tests", () => {
  it("should deny access without token", async () => {
    const res = await request(app).get("/api/admin");
    expect(res.status).toBe(401);
  });
});