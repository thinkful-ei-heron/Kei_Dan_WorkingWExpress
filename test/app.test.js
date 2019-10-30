const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps endpoint', () => {
  it('should return 400 if incorrect query string value for sort', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'invalid' })
      .expect(400, 'Error sort must be by rating or app');
  });

  it('should return 400 if wrong genre', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Adventure' })
      .expect(400, 'Error, genre values must be one of Action, Puzzle, Strategy, Casual, Arcade, Card');
  });

  it('should return only valid results for specified genre', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Action' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let filtered = true;
        let i = 0;
        //console.log(res.body[0]);
        expect(res.body[0].Genres).to.be.a('string');
        while (i < res.body.length) {
          const genre = res.body[i].Genres.split(';');
          if (!genre.includes('Action')) {
            filtered = false;
            break;
          }

          i++;
        }
      });
  });

  it('should properly sort results by Rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        // iterate once less than the length of the array
        // because we're comparing 2 items in the array at a time
        while (i < res.body.length - 1) {
          // compare book at `i` with next book at `i + 1`
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          // if the next book is less than the book at i,
          if (appAtIPlus1.rating < appAtI.rating) {
            // the books were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should properly sort results by App', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        // iterate once less than the length of the array
        // because we're comparing 2 items in the array at a time
        while (i < res.body.length - 1) {
          // compare book at `i` with next book at `i + 1`
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          // if the next book is less than the book at i,
          if (appAtIPlus1.rating < appAtI.rating) {
            // the books were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});
