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

    //% block="ultima resposta Aules que Cremen"
    //% weight=70
    export function resposta(): string {
        return ultimaResposta
    }

    //% block="ultima resposta conte %text"
    //% text.defl="SEND OK"
    //% weight=65
    export function respostaConte(text: string): boolean {
        return ultimaResposta.indexOf(text) >= 0
    }

    //% block="envia lectura a ESP32 IP %ip aula %aula temperatura %temperatura humitat %humitat"
    //% ip.defl="192.168.0.47"
    //% aula.defl="aula0"
    //% temperatura.defl=25.3
    //% humitat.defl=61
    //% weight=100
    export function enviaLecturaESP32(ip: string, aula: string, temperatura: number, humitat: number): boolean {

        let ruta = "/lectura?aula=" + aula + "&t=" + temperatura + "&h=" + humitat

        let peticio =
            "GET " + ruta + " HTTP/1.1\r\n" +
            "Host: " + ip + "\r\n" +
            "Connection: close\r\n\r\n"

        let cmdStart = 'AT+CIPSTART="TCP","' + ip + '",80'
        let res = ESP8266_IoT.sendRequest(cmdStart, "OK", 8000)

        if (!desa(res) || res.indexOf("OK") < 0) {
            basic.showString("E")
            return false
        }

        basic.showString("1")

        let cmdSend = "AT+CIPSEND=" + peticio.length
        res = ESP8266_IoT.sendRequest(cmdSend, ">", 5000)

        if (!desa(res) || res.indexOf(">") < 0) {
            basic.showString("C")
            return false
        }

        basic.showString("2")

        ESP8266_IoT.sendAT(peticio, 100)
        res = ESP8266_IoT.sendRequest("", "SEND OK", 8000)

        if (desa(res) && res.indexOf("SEND OK") >= 0) {
            basic.showString("S")
            return true
        }

        basic.showString("F")
        return false
    }
}
