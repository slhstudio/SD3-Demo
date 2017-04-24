function createStream () {
    function ranNum() {
        return Math.floor(Math.random()*99);;
    }

    let array = [];

    setInterval(() => {
        array.push({
            number: ranNum(),
            createdAt: new Date()
        })
    }, 1000)

    return array;
}

let stream = createStream();

exports.createStream = createStream;