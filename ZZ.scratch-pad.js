    
  let cachedFreq = [{"text":"your","size": 10},{"text":"the","size": 20}];
  let freq = [{"text":"your","size": 10},{"text":"the","size": 50},{"text":"at","size": 10}];

    function determineLargestChange() {
      let largestSizeChange = 0;

      for (let i = 1; i < cachedFreq.length; i += 1) {
        let changeInSize = freq[i].size - cachedFreq[i].size
        if (changeInSize > largestSizeChange) {largestSizeChange = changeInSize;} 
      }
			
			return largestSizeChange;
    }

		console.log( determineLargestChange() )