const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../model/todo');

const todosMock = [
    {
        _id: new ObjectID(),
        text: 'First test todo',
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo'
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todosMock);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[ 0 ].text).toEqual(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should NOT create todo with invalid body data', (done) => {
        const todosMockLength = todosMock.length;

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(todosMockLength);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        const todosMockLength = todosMock.length;

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(todosMockLength);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get a todo by id', (done) => {
        const id = todosMock[0]._id.toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todosMock[0].text);
            })
            .end(done);
    });

    it('should return a 404 if a todo is not found', (done) => {
        const id = new ObjectID("68f0f0f781fdb2155434b6db").toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it('should return a 404 for non-object ids', (done) => {
        const id = "123abc";

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexId = todosMock[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID("68f0f0f781fdb2155434b6db").toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        const id = "123abc";

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});