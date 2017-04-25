//function pushes a random 1-100 number and date every second into array
//initializing a new variable to the return value of this function will provide you with the "stream" of data

function createStream () {
    function ranNum() {
        return Math.floor(Math.random()*99);;
    }

    function pushToArray () {
        array.push({
            number: ranNum(),
            createdAt: new Date()
        })
    }
    let array = [];

    pushToArray();

    setInterval(pushToArray, 1000);

    return array;
}

let stream = createStream();

exports.createStream = createStream;