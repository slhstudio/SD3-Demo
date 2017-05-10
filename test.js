    let w = 500;
    let h = 500;
    
    function alterSize(freq) {
      if (freq.length > 5) {
        h += 50;
        w += 50;
      }
    }

    alterSize([2,3,4,4,5,5]);

    console.log(w, h);