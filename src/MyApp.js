import React from 'react'
import { withLeapContainer } from 'react-leap'

const MyApp = ({frame, matrix, json}) => {
    const hands = frame.hands;

    let palm, thumb, index, middle, ring, pinky;


    if(hands != null && hands.length > 0) {
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

        if(hands.length === 1){
            /*console.log("thumb: "+hands[0].pointables[0].direction);
            console.log("index: "+hands[0].pointables[1].direction);
            console.log("middle: "+hands[0].pointables[2].direction);
            console.log("ring: "+hands[0].pointables[3].direction);
            console.log("pinky: "+hands[0].pointables[4].direction);
            //console.log(hands[0].direction[0]+" "+hands[0].direction[1]+" "+hands[0].direction[2]);
            //console.log("x: "+hands[0].pointables[0].direction[0]+" y: "+hands[0].pointables[0].direction[1]+"z: "+hands[0].pointables[0].direction[2]);*/
            if(hands[0].pointables[0].direction[0] >= 0 && hands[0].pointables[0].direction[1] >= 0 && hands[0].pointables[0].direction[2] <0){
                console.log("ADIOS");
                sound(1);
            }else{
                if(hands[0].pointables[0].direction[0] >= 0 && hands[0].pointables[0].direction[1] <= 0 && hands[0].pointables[0].direction[2] < 0){
                    console.log("BIEN");
                    sound(2);
                }else{
                    console.log("HOLA");
                    sound(3);
                }
            }
        }else{
            if(hands.length === 2){
                if(hands[0].grabStrength === 0){
                    console.log("APLAUSOS");
                    sound(4);
                }else{
                    console.log("NOS VEMOS");
                    sound(5);
                }
            }
        }

    }else{
        json=[];
    }

    return (
        <div>
            {JSON.stringify(json)}
        </div>
    )
};

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

function sound(n){
    var audio;
    switch(n){
        case 1:
            /*audio = new Audio("Adios.m4a");
            audio.play();*/
            wait(3000);
            break;
        case 2:
            /*audio = new Audio("Bien.m4a");
            audio.play();*/
            wait(3000);
            break;
        case 3:
            /*audio = new Audio("Hola.m4a");
            audio.play();*/
            wait(3000);
            break;
        case 4:
            /*audio = new Audio("Aplausos.m4a");
            audio.play();*/
            wait(3000);
            break;
        case 5:
            /*audio = new Audio("NosVemos.m4a");
            audio.play();*/
            wait(3000);
            break;
    }
}

export default withLeapContainer(MyApp)