function newStream () {
    function ranNum() {
        return Math.floor(Math.random()*9);;
    }
    
    let result = [
        {value: ranNum(), createdAt: 0},
        {value: ranNum(), createdAt: 1},
        {value: ranNum(), createdAt: 2},
        {value: ranNum(), createdAt: 3},
        {value: ranNum(), createdAt: 4},

    ];
    return result;
}


exports.newStream = newStream;