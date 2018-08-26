const fs = require('fs');

const datos = ["adios", "aplausos", "bien", "hola", "nos_vemos"];
const map = {"adios":[], "aplausos":[], "bien":[], "hola":[], "nos_vemos":[]};

for(let i=0;i<datos.length;i++){
    for(let y=0; y<=200;y++ ){
        try {
            let string = JSON.parse(fs.readFileSync(`${datos[i]}/${y}.json`).toString());
            map[datos[i]] = [...map[datos[i]], {id:y, value: string.length, text: string }];
        }catch (e) {

        }
    }
}

let sum, avg = 0;


for(let i=0;i<datos.length;i++) {
    if (map[datos[i]].length) {
        sum = map[datos[i]].map(item => item.value).reduce(function (a, b) {
            return a+b;
        });
        avg = sum / map[datos[i]].length;
        const data = map[datos[i]].filter(item => item.value >= (~~avg)-10);
        data.map((item,index) => {
            fs.writeFile(`real/${datos[i]}/${index}.json`, JSON.stringify(item.text.slice(0, (~~avg)-10)), function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    }
}
