// Extensio per Aules que Cremen
// micro:bit + IoT:bit / ESP8266 -> ESP32 passarel·la local

//% color=#ff6f00 icon="\uf2c9" block="Aules que Cremen"
namespace AulesQueCremen {

    let ultimaResposta = ""

    function desa(res: string): boolean {
        if (res && res.length > 0) {
            ultimaResposta = res
            return true
        } else {
            ultimaResposta = "SENSE_RESPOSTA"
            return false
        }
    }

    function esperaResposta(text: string, timeout: number): boolean {
        let res = ESP8266_IoT.sendRequest("", text, timeout)
        desa(res)
        return ultimaResposta.indexOf(text) >= 0
    }

    function enviaComanda(comanda: string, espera: string, timeout: number): boolean {
        ESP8266_IoT.sendAT(comanda, 100)
        return esperaResposta(espera, timeout)
    }

    //% block="ultima resposta Aules que Cremen"
    //% weight=70
    export function resposta(): string {
        return ultimaResposta
    }

    //% block="envia lectura a ESP32 IP %ip aula %aula temperatura %temperatura humitat %humitat"
    //% ip.defl="192.168.0.47"
    //% aula.defl="aula0"
    //% temperatura.defl=25.3
    //% humitat.defl=61
    //% weight=100
    export function enviaLecturaESP32(
        ip: string,
        aula: string,
        temperatura: number,
        humitat: number
    ): boolean {

        let ruta =
            "/lectura?aula=" +
            aula +
            "&t=" +
            temperatura +
            "&h=" +
            humitat

        let peticio =
            "GET " + ruta + " HTTP/1.1\r\n" +
            "Host: " + ip + "\r\n" +
            "Connection: close\r\n\r\n"

        let cmdStart = 'AT+CIPSTART="TCP","' + ip + '",80'

        if (!enviaComanda(cmdStart, "OK", 8000)) {
            ultimaResposta = "ERROR_CIPSTART"
            basic.showString("E")
            return false
        }

        basic.showString("1")
        basic.pause(300)

        let cmdSend = "AT+CIPSEND=" + peticio.length

        if (!enviaComanda(cmdSend, ">", 5000)) {
            ultimaResposta = "ERROR_CIPSEND"
            basic.showString("C")
            return false
        }

        basic.showString("2")
        basic.pause(300)

        // Enviem el GET
        serial.writeString(peticio)

        // Esperem una mica perquè l'ESP8266 l'enviï
        basic.pause(3000)

        ultimaResposta = "GET_ENVIAT"

        basic.showString("S")
        return true
    }
}
