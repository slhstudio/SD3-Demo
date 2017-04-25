//function pushes a random 1-100 number and date every second into array
//initializing a new variable to the return value of this function will provide you with the "stream" of data

function createStream () {
    function ranNum() {
        return Math.floor(Math.random()*10);;
    }
    let count = 0;
    function pushToArray () {
        array.push({
            value: ranNum(),
            createdAt: count += 1
        })
    }
    let array = [];

    pushToArray();

    setInterval(pushToArray, 1000);

    return array;
}

exports.createStream = createStream;