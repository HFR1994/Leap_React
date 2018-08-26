const Leap = require('leapjs');
const fs = require('fs');

let json=[];
let external=0;
let cont=0;
let reading = true;

let senas = ["nos_vemos"];

const controller = Leap.loop({enableGestures:true, optimizeHMD: true}, function(frame) {

    if(cont >= 201){
        external=external+1;
        cont = 0;
    }

    const hands = frame.hands;

    let palm, thumb, index, middle, ring, pinky;

    if((hands != null && hands.length >= 1)) {
        reading = false;
        palm = hands[0].palmPosition;
        thumb = hands[0].thumb.tipPosition;
        index = hands[0].indexFinger.tipPosition;
        middle = hands[0].middleFinger.tipPosition;
        ring = hands[0].ringFinger.tipPosition;
        pinky = hands[0].pinky.tipPosition;

        json[json.length] = {
            palm: palm,
            thumb: [(thumb[0]-palm[0]),(thumb[1]-palm[1]),(thumb[2]-palm[2])],
            index: [(index[0]-palm[0]),(index[1]-palm[1]),(index[2]-palm[2])],
            middle: [(middle[0]-palm[0]),(middle[1]-palm[1]),(middle[2]-palm[2])],
            ring: [(ring[0]-palm[0]),(ring[1]-palm[1]),(ring[2]-palm[2])],
            pinky: [(pinky[0]-palm[0]),(pinky[1]-palm[1]),(pinky[2]-palm[2])]
        }

    }else{
        if(!reading) {
            fs.writeFile(`${senas[external]}/${cont}.json`, JSON.stringify(json), function (err) {
                if (err) {
                    return console.log(err);
                }
                cont = cont + 1;
                json = [];
                console.log(`Salvado el numero ${cont} de ${senas[external]}`);
            });
            reading=true;
        }
    }
});