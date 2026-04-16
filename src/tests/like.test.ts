import request from "supertest";
import app from "../app";

describe("Like API", () => {
  let token = "";
  let postId = "";

  beforeAll(async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    token = login.body.token;

    const post = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Like Test",
        content: "Test",
      });

    postId = post.body.post._id;
  });

  it("should like a post", async () => {
    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
  });

  it("should not allow duplicate like", async () => {
    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });
});