/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {
  

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      const filter = req.query;
      if (filter._id) filter._id = new ObjectId(filter._id);
      if (filter.open) filter.open = String(filter.open) === 'true';
      const client = MongoClient(process.env.DB, { useNewUrlParser: true });
      client.connect((err) => {
        const db = client.db();
        db.collection(project).find(filter).toArray((err, docs) => {
          res.json(docs);
          client.close();
        });
      });
    })
    
    .post(function (req, res){
      const project = req.params.project;
      const client = MongoClient(process.env.DB, { useNewUrlParser: true });
      client.connect((err) => {
        const db = client.db();
        const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;
        const issue = {
          issue_title: issue_title,
          issue_text: issue_text,
          created_by: created_by,
          assigned_to: assigned_to || '',
          status_text: status_text || '',
          created_on: new Date,
          updated_on: new Date,
          open: true
        };
        if (!issue_title || ! issue_text || ! created_by) {
          res.status(400).send('Required fields missing');
          return;
        }
        db.collection(project).insertOne(issue, (err, r) => {
          issue._id = r.insertedId;
          res.json(issue);
          client.close();
        });
      });
    })
    
    .put(function (req, res){
      const project = req.params.project;
      if (!req.body._id) {
        res.status(400).send('Issue Id is missing');
        return;
      }
      const issueId = req.body._id;
      delete req.body._id;
      let fields = req.body;
      for (let f in fields) {
        if(!fields[f]) {
          delete fields[f];
        }
      }
      if(Object.keys(fields).length === 0) {
        res.status(400).send('no updated field sent');
        return;
      }
      if (fields.open) {
        fields.open = String(fields.open) === "true";
      }
      const client = MongoClient(process.env.DB, { useNewUrlParser: true });
      client.connect((err) => {
        const db = client.db();
        fields.updatedOn = new Date();
        db.collection(project).updateOne({_id: new ObjectId(issueId)}, {$set: fields}, {new: true}, (err, doc) => {
          (err) ? res.send('could not update ' + issueId + ' ' + err) : res.send('successfully updated');
          client.close();
        });
      });
    })
    
    .delete(function (req, res) {
      const project = req.params.project;
      if(!req.body._id) {
        res.status(400).send('Issue id missing.');
        return;
      }
      const client = MongoClient(process.env.DB, { useNewUrlParser: true });
      client.connect((err) => {
        const db = client.db();
        const id = new ObjectId(req.body._id);
        db.collection(project).deleteOne({_id: id}, (err) => {
          (err) ? res.send(`Error deleting ${req.body._id} ${err}`) : res.send('Issue deleted.');
          client.close();
        });
      });
    });
    
};
