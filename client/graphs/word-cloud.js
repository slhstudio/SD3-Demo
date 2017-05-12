(() => {

  let customData = {};

  socket.on('send custom', (emitData) => {
    for (let key in emitData) {
      customData[key] = emitData[key]
    }
  });


  //these values will change dynamically based on how many words are in freq;
  let cachedSize = 5;
  let h = 200;
  let w = 500;

  //get data from socket and store it in freq
  var freq = [{ "text": "your", "size": 10 }, { "text": "the", "size": 20 }, { "text": "at", "size": 10 }];

  function includes(word) {
    return freq.some(obj => {
      return obj.text === word;
    })
  }


  socket.on('send audioData', (data) => {
    console.log('DATA RECEIVED', Date.now());
    //if word is in freq arr, then add 1; if not add it
    data.split(' ').forEach(word => {
      word = word.toLowerCase();
      freq.forEach(obj => {
        if (obj.text === word) {
          obj.size += customData.fontSize;
        }
        if (!includes(word)) {
          freq.push(
            { text: word, size: customData.fontSize }
          )
        }
      })
    });

    cloud()
      .size([w, h])
      .words(freq)
      .padding(customData.padding)
      .overflow(true)
      .rotate(customData.rotate)
      .font(customData.font)
      .fontSize(function (d) { return d.size; })
      .on("end", hasGrid)
      .start();
  })

  let settings;

  function hasGrid(words) {

    if (!settings) settings = drawGrid(words);
    drawCloud(settings, words);

  }

  function drawGrid(data) {
    console.log('drawing grid...', data);

    let color = d3.scaleLinear()
      .domain(customData.colorDomain)
      .range(customData.colors);

    let fillColor = d3.scaleOrdinal(d3.schemeCategory20);

    d3.select("#wordCloud").remove()

    let svg = d3.select("#word-cloud").append("svg")
      .attr('id', 'wordCloud')
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr('id', 'g-container')
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")

    let settings = {
      svg,
      color,
      fillColor,
    }

    return settings;
  }

  function drawCloud(settings, words) {
    console.log('drawing cloud...', words);
    //remove so doesn't make multiple word clouds
    let svg = settings.svg;
    let color = settings.color;
    let fillColor = settings.fillColor;

    let Existingwords = svg.selectAll('.text')
      .data(words);

    console.log('EXISTING WORDS: ', Existingwords);

    let newWords = Existingwords
      .enter()
      .append("text").transition()
      .duration(1000)
      .attr("opacity", 1)
      .attr('class', 'text')
      .style("font-size", function (d) { return (d.size) + "px"; })
      .style("font-family", customData.font)
      .style("fill", function (d, i) { return color(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function (d, i) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) { return d.text; });

    Existingwords.transition()
      .duration(1000)
      .attr("opacity", 1)
      .attr("transform", function (d, i) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .style("font-size", function (d) { return (d.size) + "px"; })
      .text(function (d) { return d.text; });
  }



  //--------------------CREATE GRAPH----------------------------------
  //d3 version 3 way of adding color;
  //let fillColor = d3.scale.category20b();

  function alterSize() {
    if (freq.length >= cachedSize) {
      h += 40;
      w += 70;
      cachedSize += 5;
    }
  }
  alterSize();

  console.log('WIDTH', w, 'HEIGHT', h);
  console.log('LENGTH', freq.length);
  console.log('cache', cachedSize);

})()