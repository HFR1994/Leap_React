import React, {Component} from 'react';
import { withLeapContainer } from 'react-leap';
import ReactHowler from 'react-howler';

let audioParts = [];
let finalAudio = undefined;
let websocket = undefined;
let json = [];

class MyApp extends Component {

    constructor(props) {
        super(props);
        this.state={
            base64data:undefined,
            ready: true
        };
        this.onError = this.onError.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.sound = this.sound.bind(this);
    }


    render() {

        const hands = this.props.frame.hands;

        const {ready, base64data} = this.state;

        let palm, thumb, index, middle, ring, pinky;

        if (hands != null && hands.length > 0 && ready) {
            palm = hands[0].palmPosition;
            thumb = hands[0].thumb.tipPosition;
            index = hands[0].indexFinger.tipPosition;
            middle = hands[0].middleFinger.tipPosition;
            ring = hands[0].ringFinger.tipPosition;
            pinky = hands[0].pinky.tipPosition;

            json[json.length] = {
                palm: palm,
                thumb: [(thumb[0] - palm[0]), (thumb[1] - palm[1]), (thumb[2] - palm[2])],
                index: [(index[0] - palm[0]), (index[1] - palm[1]), (index[2] - palm[2])],
                middle: [(middle[0] - palm[0]), (middle[1] - palm[1]), (middle[2] - palm[2])],
                ring: [(ring[0] - palm[0]), (ring[1] - palm[1]), (ring[2] - palm[2])],
                pinky: [(pinky[0] - palm[0]), (pinky[1] - palm[1]), (pinky[2] - palm[2])]
            };

            if (hands.length === 1) {
                if (hands[0].pointables[0].direction[0] >= 0 && hands[0].pointables[0].direction[1] >= 0 && hands[0].pointables[0].direction[2] < 0) {
                    console.log("ADIOS");
                    this.sound(1);
                } else {
                    if (hands[0].pointables[0].direction[0] >= 0 && hands[0].pointables[0].direction[1] <= 0 && hands[0].pointables[0].direction[2] < 0 && hands[0].pointables[4].direction[0] > 0) {
                        console.log("BIEN");
                        this.sound(2);
                    } else {
                        console.log("HOLA");
                        this.sound(3);
                    }
                }
            } else {
                if (hands.length === 2) {
                    if (hands[0].grabStrength === 0) {
                        console.log("APLAUSOS");
                        this.sound(4);
                    } else {
                        console.log("NOS VEMOS");
                        this.sound(5);
                    }
                }
            }
        } else {
            json = [];
        }

        if(base64data){
            return(
                <ReactHowler
                    src={base64data}
                    playing={true}
                    onEnd={() => {
                        this.setState({ready:true, base64data: undefined})
                    }}
                />
            )
        }else {
            return (
                <div>
                    {JSON.stringify(json)}
                </div>
            )
        }
    };


    onMessage(evt) {
        if (typeof evt.data === 'string') {
            console.log('Received string message: ', evt.data)
        } else {
            console.log('Received ' + evt.data.size + ' binary bytes', evt.data.type);
            audioParts.push(evt.data);
        }
    }

    onError(evt) {
        console.log('WebSocket error', evt);
    }

    sound(n) {

        let message;
        const voice = "es-LA_SofiaVoice";
        const token = "1Gk%2F31Nwcfn%2FNGF3luAM%2BI4KnvKkLwLpdLF77DIxquSaYs9ZjyhYL2iCWVw%2BGqRP7IHmeFGepoQXIoQ%2BmaLPAKLHy3dQuJyQaRwaRqMCMDstga28qzHX3twB3KinxJZ%2Fef0JojDbBZcft3Bi8lJ0N6nn1rMIonZ97w3ocKT3OPkR7fJdcEqyBfpXuuRtEvxAYti%2FOC1qa1NU%2FNNQr6M%2BUI3H52HsnARBEnZ1IZcuIwrdvENhvAHGhbtaYi3OUgD8EWepuBLIMJELwuXbPYNalpODgHy%2FBQUPUE52McvBZaVRcT%2FCW2pUGSmAj6szIMz0RFy7c2mNRYbVnumYA6sUJJOVccEYwB2Y7duTMrHjt7pNxVIhd1vsnW0ek6s7zSzyhugKvN6Psxbeidw0K3YEKeroeGuBk2PGgIDlfJdTSAeiiTbZHrY9gAWjKklF8vm5XmL8%2B0MHTzSl%2FDg%2BlxUwXyFa3hsr88uBtPRqLYp0ocp5jWAQ9tFN5UuXIWQSXBvEYEr4%2BbXn13GlKPndsZoLtX5QbHqfoYFIxbIwZbOFkmQ69hCfqkAJna9DccyjxtG1MKFTQhDT8sECzAnk3MCEKppcaWtGb31fXXOdrdck%2BCg%2FeWycrFsl9N3YlY%2BHSRM4z%2Bo2Eu%2BjN5U2zxFaWF9jdCKMNF%2Fbb9%2BFyGWymZU2sEghOH054j3LYmkwhyDVOoyTz2nqRiaVGtS3P9%2BvFMWNC5bKUtPLmNUE%2Fo3FuBgpHuqzPVwP2VE9xzg4CrKMNIhgitXnAJGYGkEm6l4aZ%2FzMRE5LpDMbp0nYqoNKO5FsUAsddxTRumrGG4W8DvbUFfF8g09w8BR7ZlqRUNUub09Bf7yjug3fpZMBrFlHQlCin6c3wRfnx%2BW4bOBNFV7vl6mAnxilpHgW56dfxd4jG%2BPfWofKnEeIokaVaHSO8w3%2BUiHpnIqC86IzrvPz0JE9kufBFjbFmmlCzrSXpxB%2FwLRLKc3yJpANU2V1m8mUsxrjom4%3D";
        const wsURI = "wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=" +
            voice + "&watson-token=" + token;


        websocket = new WebSocket(wsURI);
        websocket.onmessage = this.onMessage;
        websocket.onerror = this.onError;

        const self = this;

        websocket.addEventListener('open', function (event) {
            const format = 'audio/ogg;codecs=opus';

            switch (n) {
                case 1:
                    message = {
                        text: "Adios",
                        accept: format
                    };
                    websocket.send(JSON.stringify(message));
                    break;
                case 2:
                    message = {
                        text: "Bien",
                        accept: format
                    };
                    websocket.send(JSON.stringify(message));
                    break;
                case 3:
                    message = {
                        text: "Hola",
                        accept: format
                    };
                    websocket.send(JSON.stringify(message));
                    break;
                case 4:
                    message = {
                        text: "Aplausos",
                        accept: format
                    };
                    websocket.send(JSON.stringify(message));
                    break;
                default:
                    message = {
                        text: "Nos vemos",
                        accept: format
                    };
                    websocket.send(JSON.stringify(message));
                    break;
            }
        });

        websocket.addEventListener('close', function (event) {
            const format = 'audio/ogg;codecs=opus';
            const reader = new FileReader();
            finalAudio = new Blob(audioParts, {type: format});
            reader.readAsDataURL(finalAudio);
            audioParts = [];
            reader.onloadend = function () {
                self.setState({base64data: reader.result});
            };
        });

        this.setState({ready:false});
    }

}

export default withLeapContainer(MyApp);