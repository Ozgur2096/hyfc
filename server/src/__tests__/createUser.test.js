import supertest from "supertest";
import {
  connectToMockDB,
  closeMockDatabase,
  clearMockDatabase,
} from "../__testUtils__/dbMock.js";
import app from "../app.js";
// import { findUserInMockDB } from "../__testUtils__/userMocks.js";

const request = supertest(app);

beforeAll(async () => {
  await connectToMockDB();
});

afterEach(async () => {
  await clearMockDatabase();
});

afterAll(async () => {
  await closeMockDatabase();
});

const testUserBase = {
  firstName: "John",
  lastName: "Doe",
  hyfClass: "hyfInput",
  role: "Student",
  email: "john@doe.com",
  password: "waeraU4949__",
};

describe("POST /api/user/signup", () => {
  it("Should return a bad request if no user object is given", (done) => {
    request
      .post("/api/user/signup")
      .then((response) => {
        expect(response.status).toBe(400);

        const { body } = response;
        expect(body.success).toBe(false);
        // Check that there is an error message
        expect(body.msg.length).not.toBe(0);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a bad request if the user object does not have a firstName", (done) => {
    const testUser = { email: testUserBase.email };

    request
      .post("/api/user/signup")
      .send({ user: testUser })
      .then((response) => {
        expect(response.status).toBe(400);

        const { body } = response;
        expect(body.success).toBe(false);
        // Check that there is an error message
        expect(body.msg.length).not.toBe(0);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a bad request if the user object does not have an email", (done) => {
    const testUser = { firstName: testUserBase.firstName };

    request
      .post("/api/user/signup")
      .send({ user: testUser })
      .then((response) => {
        expect(response.status).toBe(400);

        const { body } = response;
        expect(body.success).toBe(false);
        // Check that there is an error message
        expect(body.msg.length).not.toBe(0);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a bad request if the user object has extra fields", (done) => {
    const testUser = { ...testUserBase, foo: "bar" };

    request
      .post("/api/user/signup")
      .send({ user: testUser })
      .then((response) => {
        expect(response.status).toBe(400);

        const { body } = response;
        expect(body.success).toBe(false);
        // Check that there is an error message
        expect(body.msg.length).not.toBe(0);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  // it("Should return a success state if a correct user is given", async () => {
  //   const testUser = { ...testUserBase };

  //   return request
  //     .post("/api/user/signup")
  //     .send({ user: testUser })
  //     .then((response) => {
  //       expect(response.status).toBe(201);

  //       const { body } = response;
  //       expect(body.success).toBe(true);
  //       expect(body.user.firstName).toEqual(testUser.firstName);
  //       expect(body.user.lastName).toEqual(testUser.lastName);
  //       expect(body.user.hyfClass).toEqual(testUser.hyfClass);
  //       expect(body.user.role).toEqual(testUser.role);
  //       expect(body.user.email).toEqual(testUser.email);
  //       expect(body.user.password).toEqual(testUser.password);

  //       // Check that it was added to the DB
  //       return findUserInMockDB(body.user._id);
  //     })
  //     .then((userInDb) => {
  //       expect(userInDb.firstName).toEqual(testUser.firstName);
  //       expect(userInDb.email).toEqual(testUser.email);
  //     });
  // });
});
