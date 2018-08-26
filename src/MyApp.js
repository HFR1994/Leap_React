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
        const token = "6WPkuRpsVpZGhGWAcpZr9heiHrzYQFB7Y0dF%2BaIw83Ewx6%2FMzW6FfR%2BtjMCZTSzQ%2Focsoe3xPxbxSB7xPGvGdOZFe58H2Jw%2FgdvpkAvrnZzwYgi5CnbVwmvWLcNwfyFc%2BJULvBogBOdeLUI5ar49jbPvgLgyLz06vR1TpjNfTQzCwQxLBg2715XpN1CelaqkLthddgQo0ki%2FK%2FauofvUflmv1qP8eFSPBMXUfjdElM8dL9yvYsSBeixz9zATIGMWE8OFXRCGh%2FqX05dZSX1FUCx%2FT7I6Lv2cVtieVjfFrHj44fITo5bKhBqWIeq6UOOs8OdTemyLBj3%2BF9NfZtloeh6n6jGlGrxNfYT4xNc9jaMv2PhyZQTFC2%2FPady4OkiJMEjehZQjUQTq5PV7f7p87iXktHCY9OJUSY3lG6OKDjUiM1HMqzc%2Fxo%2F04E5%2BGoR1yMEq9%2F5a%2B3AOqWh7oPcapdc%2Bfscep0kf9Jjzo8FDI4nzUIBpHdzCOZJ%2B%2Fil4Enj7DWYDsgJCDa02B1iZ%2BEcLRyl%2BLg9VBDrF7gd53enJuDKL7EH6V6TgEao6OmNlrzEw4uvpg5RYlDUafO2102GAf9iyfAmK8kQqSgrqCcLiidUZbYva1uLCt61gufocnLs%2BxtK39fUFfJFZnmmGW%2Bxin5AzITVaNEJUeLq9DSGs7oPONiqEwUzCqzV1KqG3JkCju6ItjYg4zrqjMikFUAAfaTi9lvDN%2Fb%2Fm4Dz5I%2BO7EC4zijRC9dbx%2BEfXiKSr86DyNk9nz%2FW9xxDJQMTKJcO4mFGTWeC0AaT%2F0UyJWEy7%2BM7fUXfoETh0d84FanG4lx4o5dQmP%2FavyT0ObqTwfuP5BgrxpPaVbUdQQP7K2HszqfgTtzk0RLjTTsGPhRMV%2F0YhuQxVev%2BBZFo8X49TmCxlo%2F29RdzF9lNzKViQTkFVD0FnHl8eO1nvtFqP%2FFCC2%2FIe1pDkOe7Ymcf23CRi%2F8zLThlJ3kGrYSOuu8ictkGXy40%3D";
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
            if(finalAudio.size !== 0) {
                reader.readAsDataURL(finalAudio);
                audioParts = [];
                reader.onloadend = function () {
                    self.setState({base64data: reader.result});
                };
            }else {
                console.log("Recibí cero bytes");
                self.setState({ready: true});
            }
        });

        this.setState({ready:false});
    }

}

export default withLeapContainer(MyApp);