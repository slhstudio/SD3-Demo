const assert = require('chai').assert;
const expect = require('chai').expect;
//--------------------------------------------

let currData = [{text: 'seattle', volume: 15}, {text: 'houston', volume: 20}, {text: 'new york', volume: 40}];

let data1 = [{text: 'miami', volume: 45}, {text: 'houston', volume: 20}];

let data2 = [{text: 'miami', volume: 15}, {text: 'houston', volume: 20}, {text: 'new york', volume: 40}];


function isNewData(a, b) {
  if (a.length !== b.length) { return 'true: not same length' };

  for (let i = 0; i < a.length; i += 1) {
    if (a[i].text === b[i].text && a[i].volume !== b[i].volume) {
      reRenderNode(b[i]);

    } else if (a[i].text !== b[i].text) {
      return true;
    };
  }
  return false;
}

//-------------------
describe('isNewData function', () => {
  it('should return true if arguments are the same length', () => {

    assert.equal(isNewData(currData, data1), 'true: not same length');
  });
  
  it('should return true if text is not the same but lengths are still equal', () => {
    
    assert.equal(isNewData(currData, data2), true);
  });

  it('should return false if data and lengths are the same', () => {
    
    assert.equal(isNewData(currData, currData), false);
  });

});