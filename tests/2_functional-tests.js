/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let id1;
  let id2;
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(res.body.open, true);
          id1 = res.body._id; // store the id for later use
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server).post('/api/issues/test')
          .send({
            issue_title: 'Bare minimum',
            issue_text: 'Absolute minimum',
            created_by: 'Typing'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'open');
            assert.property(res.body, 'status_text');
            assert.property(res.body, '_id');
            assert.equal(res.body.issue_title, 'Bare minimum');
            assert.equal(res.body.issue_text, 'Absolute minimum');
            assert.equal(res.body.created_by, 'Typing');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            assert.equal(res.body.open, true);
            id2 = res.body._id;
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({}).end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'Required fields missing');
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({_id: id1})
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'no updated field sent');
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: id2,
          assigned_to: 'Chai and Mocha'
        }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: id2,
          issue_text: 'Issue set to fixed',
          open: false
        }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({assigned_to: 'Chai and Mocha'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({assigned_to: 'Chai and Mocha', open: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Issue id missing.');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: id2})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Issue deleted.');
          done();
        });
      });
      
    });

});
