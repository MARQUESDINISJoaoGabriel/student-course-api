describe('API Integration Tests - Controllers', () => {
  const request = require('supertest');
  const app = require('../../src/app');

  beforeEach(() => {
    require('../../src/services/storage').reset();
    require('../../src/services/storage').seed();
  });

    // STUDENT TESTS
  test('GET /students should list all students', async () => {
    const res = await request(app).get('/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.students.length).toBe(3);
    expect(res.body.total).toBe(3);
  });

  test('GET /students with name filter', async () => {
    const res = await request(app).get('/students?name=Alice');
    expect(res.statusCode).toBe(200);
    expect(res.body.students.length).toBe(1);
    expect(res.body.students[0].name).toBe('Alice');
  });

  test('GET /students with email filter', async () => {
    const res = await request(app).get('/students?email=bob');
    expect(res.statusCode).toBe(200);
    expect(res.body.students.length).toBe(1);
    expect(res.body.students[0].email).toBe('bob@example.com');
  });

  test('GET /students with pagination', async () => {
    const res = await request(app).get('/students?page=1&limit=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.students.length).toBe(2);
    expect(res.body.total).toBe(3);
  });

  test('PUT /students/:id should update student name', async () => {
    const res = await request(app)
      .put('/students/1')
      .send({ name: 'Alice Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Alice Updated');
  });

  test('PUT /students/:id should update student email', async () => {
    const res = await request(app)
      .put('/students/1')
      .send({ email: 'newemail@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('newemail@example.com');
  });

  test('PUT /students/:id should reject duplicate email', async () => {
    const res = await request(app)
      .put('/students/1')
      .send({ email: 'bob@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email must be unique');
  });

  test('PUT /students/:id should return 404 for non-existent student', async () => {
    const res = await request(app)
      .put('/students/999')
      .send({ name: 'Test' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Student not found');
  });

  test('POST /students should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'John' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('name and email required');
  });

  test('POST /students should create a student', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: 'David', email: 'david@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('David');
  });

  test('GET /students/:id should return student', async () => {
    const res = await request(app).get('/students/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.student.name).toBe('Alice');
  });

  test('GET /students/:id should return 404 for non-existent student', async () => {
    const res = await request(app).get('/students/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Student not found');
  });

  test('DELETE /students/:id should delete student', async () => {
    const res = await request(app).delete('/students/1');
    expect(res.statusCode).toBe(204);
  });


  // COURSE TESTS
  test('GET /courses should list all courses', async () => {
    const res = await request(app).get('/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body.courses.length).toBe(3);
    expect(res.body.total).toBe(3);
  });

  test('GET /courses with title filter', async () => {
    const res = await request(app).get('/courses?title=Math');
    expect(res.statusCode).toBe(200);
    expect(res.body.courses.length).toBe(1);
    expect(res.body.courses[0].title).toBe('Math');
  });

  test('GET /courses with teacher filter', async () => {
    const res = await request(app).get('/courses?teacher=Smith');
    expect(res.statusCode).toBe(200);
    expect(res.body.courses.length).toBe(1);
    expect(res.body.courses[0].teacher).toBe('Mr. Smith');
  });

  test('GET /courses with pagination', async () => {
    const res = await request(app).get('/courses?page=1&limit=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.courses.length).toBe(2);
    expect(res.body.total).toBe(3);
  });

  test('POST /courses should create a course', async () => {
    const res = await request(app)
      .post('/courses')
      .send({ title: 'Chemistry', teacher: 'Dr. Green' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Chemistry');
  });

  test('POST /courses should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/courses')
      .send({ title: 'Physics' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('title and teacher required');
  });

  test('GET /courses/:id should return course', async () => {
    const res = await request(app).get('/courses/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.course.title).toBe('Math');
  });

  test('GET /courses/:id should return 404 for non-existent course', async () => {
    const res = await request(app).get('/courses/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Course not found');
  });

  test('PUT /courses/:id should update course title', async () => {
    const res = await request(app)
      .put('/courses/1')
      .send({ title: 'Advanced Math' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Advanced Math');
  });

  test('PUT /courses/:id should reject duplicate title', async () => {
    const res = await request(app)
      .put('/courses/1')
      .send({ title: 'Physics' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Course title must be unique');
  });

  test('PUT /courses/:id should update course teacher', async () => {
    const res = await request(app)
      .put('/courses/1')
      .send({ teacher: 'Dr. Smith' });
    expect(res.statusCode).toBe(200);
    expect(res.body.teacher).toBe('Dr. Smith');
  });

  test('PUT /courses/:id should return 404 for non-existent course', async () => {
    const res = await request(app)
      .put('/courses/999')
      .send({ title: 'Test' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Course not found');
  });

  test('DELETE /courses/:id should delete course', async () => {
    const res = await request(app).delete('/courses/1');
    expect(res.statusCode).toBe(204);
  });

  // ENROLLMENT TESTS
  test('POST /courses/:courseId/students/:studentId should enroll student', async () => {
    const res = await request(app).post('/courses/1/students/1');
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('POST /courses/:courseId/students/:studentId should reject duplicate enrollment', async () => {
    await request(app).post('/courses/1/students/1');
    const res = await request(app).post('/courses/1/students/1');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Student already enrolled in this course');
  });

  test('DELETE /courses/:courseId/students/:studentId should unenroll student', async () => {
    await request(app).post('/courses/1/students/1');
    const res = await request(app).delete('/courses/1/students/1');
    expect(res.statusCode).toBe(204);
  });

  test('DELETE /courses/:courseId/students/:studentId should return 404 for non-existent enrollment', async () => {
    const res = await request(app).delete('/courses/1/students/1');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Enrollment not found');
  });
});
