import React, {Component} from 'react';
import { withLeapContainer } from 'react-leap';
import ReactHowler from 'react-howler';
import Dictionary from "oxford-dictionary";
import adios from './responses/adios';
import aplauso from './responses/aplauso';
import bien from './responses/bien';
import hola from './responses/hola';
import ver from './responses/ver'
import Typing from 'react-typing-animation';
import './App.css';

let audioParts = [];
let finalAudio = undefined;
let websocket = undefined;
let json = [];
const datos = ["adios","bien","hola","aplauso","ver"];

class MyApp extends Component {

    constructor(props) {
        super(props);
        this.state={
            base64data:undefined,
            ready: true,
            text: " ",
            synonym: " "
        };
        this.onError = this.onError.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.sound = this.sound.bind(this);
        this.search = this.search.bind(this);
        this.quick = this.quick.bind(this);
    }

    search(number){

        const config = {
            app_id : "bc07a343",
            app_key : "94e7668ae68d54e6e2085385c48f97ca",
            source_lang : "es"
        };

        try {
            let dict = new Dictionary(config);

            dict.translate({
                word: "hola",
                target_language: "en"
            }).then(function (res) {

                    return res.json();
                },
                function (err) {
                    return err
                });
        }catch (err) {
            return err;
        }

    }

    quick(number){
        console.log(hola);
        switch (number) {
            case 1:
                return adios.results[0].lexicalEntries[0].entries[0].senses[0];
            case 2:
                return bien.results[0].lexicalEntries[0].entries[0].senses[0];
            case 3:
                return hola.results[0].lexicalEntries[0].entries[0].senses[0];
            case 4:
                return aplauso.results[0].lexicalEntries[0].entries[0].senses[0];
            case 5:
                return ver.results[0].lexicalEntries[0].entries[0].senses[0];
            default:
                return JSON.parse("{}");
        }
    }

    render() {

        const hands = this.props.frame.hands;

        const {ready, base64data, text, synonym} = this.state;

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
                    this.setState({text:"ADIOS"});
                    this.setState({synonym:"CHIAO"});
                    this.sound(1);
                } else {
                    if (hands[0].pointables[0].direction[0] >= 0 && hands[0].pointables[0].direction[1] <= 0 && hands[0].pointables[0].direction[2] < 0 && hands[0].pointables[4].direction[0] > 0) {
                        console.log("BIEN");
                        this.setState({text:"BIEN"});
                        this.setState({synonym:"NADA MAL"});
                        this.sound(2);
                    } else {
                        console.log("HOLA");
                        this.setState({text:"HOLA"});
                        this.setState({synonym:"SALUDOS"});
                        this.sound(3);
                    }
                }
            } else {
                if (hands.length === 2) {
                    if (hands[0].grabStrength === 0) {
                        console.log("APLAUSOS");
                        this.setState({text:"APLAUSOS"});
                        this.setState({synonym:"NO LO SE JOVEN"});
                        this.sound(4);
                    } else {
                        console.log("NOS VEMOS");
                        this.setState({text:"NOS VEMOS"});
                        this.setState({synonym:"HASTA LA PROXIMA"});
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

        this.quick(n);
        let message;
        const voice = "es-LA_SofiaVoice";
        const token = "591b0gQifoGO75X1WXZyDdpzyJf%2B%2BVnh7lCFJ0aT7ACMrhYwYAlKHD8RaivpWH5oPq1MgtnplyvBWXI8lvwq5N1UTr6wvqMpPiIxrPdsRYai1UnKMw%2Fp7Xod8IeKaVbJjf7MMKKcE9IwO3srk7kjsZr9lZuiu3t15hOp6F2cT4dXHT%2FruLuylbXSM54rqxhXJwmbDLdVJ7IaKcw4p%2FXGyd1EW50hlnu%2BPtdboB%2B5GTJ8FKelQEBsbUnXQu%2F55y0sCizVwLWQIpeu5BL1SfdoL8ja%2FBRul5mEzVFu6vSgotQySZuKvhJFJdMhd8XTU%2FxZylo3kx3zSKOk1pkXHL5SGldDA49%2F8xjvJCZQUDulAjitz%2FVQrVThBbrxkVEGgkUAbOEIi3HxZrBgUCB0eaDYOJH7%2F%2Bkbnh6oWO6nQxxCh66PiVwXTwBgDdtfrsIDRMp%2F7k67EZlfpBPApPYfudK9iu7veyODYmBOH6nvHnUEY4BA5aAKMWQPrzEqe95kP%2BWvHFWiZMB4RwUsyQSDOIoPKDMuxsyBdaJQUSI0N5K3qQZhPfQE%2FYOdI2CXu6bbtV6XTsyBz0vqVDPeODCHxb2gshZ9TAv9WT0MfU18EmRflVphQfinLhQcvzLzEOZH1pVzXTLCSQnNUNLBtTQUrOKnn4MaXPYhaoyIo89yBGron%2BlFsJbQ4ITE87w7Kiug%2FNZneNIcUny3Z0wCsIhZjcO0o8PD696%2BAgpnKJKbLnMcNIO69AUCN10m0PiVxt8l2ug6iMNwd%2FQU7Epv6iMRwH25RFn8w2wxzr%2B6ZpOsCrvTW01WwB%2B8NF1%2BdGKsvd8bwtK5O1ZZ6UQJUKZBCeHsJoeu6J1OVZVpbVYdK%2BLaHVWcz7vUfMixqE7XoSrTG8DSk%2BQdF%2BLkj4qHdBR91LwgFJw4c7iXv0bVmH%2BVYt1vd2e%2F9cLLFaM25uQNgjveuZ8m1PWjEhoSrrVhehKDP0upaCAeCJ5QBdLSSosF%2BGn20A0U1a0%3D";
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