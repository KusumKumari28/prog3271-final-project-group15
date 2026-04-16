import request from "supertest";
import app from "../app";

describe("Admin API Tests", () => {
  it("should deny access without token", async () => {
    const res = await request(app).get("/api/admin");
    expect(res.status).toBe(401);
  });
});
describe("Admin API", () => {
  let adminToken = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "123456",
    });

    adminToken = res.body.token;
  });

  it("should get analytics", async () => {
    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.analytics).toHaveProperty("totalUsers");
  });
});