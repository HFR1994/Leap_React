import React from 'react'
import { withLeapContainer } from 'react-leap'

const MyApp = ({frame, matrix, json}) => {
    const hands = frame.hands;

    let palm, thumb, index, middle, ring, pinky;


    if(hands != null && hands.length === 1) {
        console.log(hands[0].pointables[2].direction);
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
        json=[];
    }

    return (
        <div>
            {JSON.stringify(json)}
        </div>
    )
};

export default withLeapContainer(MyApp)