
const assert = require('chai').assert;
const expect = require('chai').expect;
//--------------------------------------------

function includes(word){
  return freq.some(obj => {
    return obj.text === word;
  })
}

var freq = [{"text":"your","size": 10},{"text":"the","size": 20},{"text":"at","size": 10}];


describe('includes function', () => {
  it('should return a boolean', () => {

    assert.isBoolean(includes('hi'), true, 'should return true; output is a boolean');
  });
  
  it('should return true if word is in freq', () => {
    
    assert.equal(includes('your'), true, 'should return true, your is in freq');
  });

  it('should return false if word is not in freq', () => {

    assert.equal(includes('hi'), false, 'should return false, hi is not in freq');
  })
});

//-------------------------------------------
let customData = {};

let data = 'this is THE test Data';

data.split(' ').forEach(word => {
  word = word.toLowerCase();
  freq.forEach(obj => {
    if (obj.text === word) {
      obj.size += 20;
    }
    if (!includes(word)) {
      freq.push(
        {text: word, size: 20}
      )
    }
  })
});


describe('custom data object', () => {
  it('should add only lowercase words', () => {

    let lowerCase = freq.every(obj => obj.text === obj.text.toLowerCase());

    assert.equal(lowerCase, true, 'should return true if all items are lowercase');
  });
  
  it('should add objects to the freq array', () => {
    
    expect(freq.length).to.be.at.least(5);
  });

  it('should increase size if word is already in freq', () => {

    let the = freq.filter(obj => obj.text === 'the');

    expect(the[0].size).to.be.at.least(30);
  });
});