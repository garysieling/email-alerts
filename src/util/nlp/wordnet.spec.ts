import {   getHypernyms } from './wordnet';
const assert = require('assert');

describe('get hypernyms', function() {
  it('can handle talk to wordnet', function() {
    getHypernyms(['politics'], (error, results) => {
      assert.equal([
          "politics",
          "political sympathies",
          "political science",
          "government",
          "realpolitik",
          "practical politics",
          "geopolitics",
          "geostrategy",
          "political relation"
        ], 
        results
      );
    });
  });

  it('can handle spaces', function() {
    getHypernyms(['mahayana buddhism'], (error, results) => {
      assert.equal([
        "mahayana",
        "mahayana buddhism",
        "yogacara"
      ], 
      results
      );
    });
  });

  it('can handle spaces', function() {
    getHypernyms(['buddhism', 'zen'], (error, results) => {
      assert.equal([
          "buddhism",
          "zen",
          "zen buddhism",
          "theravada",
          "theravada buddhism",
          "hinayana",
          "hinayana buddhism",
          "tantra",
          "tantrism",
          "shingon",
          "mahayana",
          "mahayana buddhism",
          "yogacara",
          "lamaism",
          "tibetan buddhism",
          "acid",
          "back breaker",
          "battery-acid",
          "dose",
          "dot",
          "elvis",
          "loony toons",
          "lucy in the sky with diamonds",
          "pane",
          "superman",
          "window pane",
          "zen",
          "zen buddhism"
      ], 
      results
      );
    });
  });
});