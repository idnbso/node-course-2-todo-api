const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../model/todo');

const todosMock = [
    {
        text: 'First test todo',
    },
    {
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