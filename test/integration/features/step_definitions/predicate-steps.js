import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

function convertStringToBoolean(string) {
  return 'true' === string;
}

Then('the predicate resolves to {string}', async function (expectedPredicateResult) {
  assert.equal(this.result, convertStringToBoolean(expectedPredicateResult));
});
