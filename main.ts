// Extensio per Aules que Cremen
// micro:bit + IoT:bit / ESP8266 -> ESP32 passarel·la local

//% color=#ff6f00 icon="\uf2c9" block="Aules que Cremen"
namespace AulesQueCremen {

    let ultimaResposta = ""

    function llegirResposta(): string {
        let resposta = ""

        while (serial.available() > 0) {
            resposta += serial.readString()
            basic.pause(20)
        }

        return resposta
    }

    function netejaSerial(): void {
        while (serial.available() > 0) {
            serial.readString()
            basic.pause(10)
        }
    }

    function enviaAT(comanda: string, espera: string, timeout: number): boolean {
        netejaSerial()

        if (comanda != "") {
            serial.writeString(comanda + "\r\n")
        }

        ultimaResposta = ""
        let inici = input.runningTime()

        while (input.runningTime() - inici < timeout) {
            ultimaResposta += llegirResposta()

            if (ultimaResposta.indexOf(espera) >= 0) {
                return true
            }

            basic.pause(50)
        }

        if (ultimaResposta.length == 0) {
            ultimaResposta = "SENSE_RESPOSTA"
        }

        return false
    }

    /**
     * Retorna l'ultima resposta rebuda de l'ESP8266.
     */
    //% block="ultima resposta Aules que Cremen"
    //% weight=70
    export function resposta(): string {
        return ultimaResposta
    }

    /**
     * Retorna cert si l'ultima resposta conte aquest text.
     */
    //% block="ultima resposta conte %text"
    //% text.defl="SEND OK"
    //% weight=65
    export function respostaConte(text: string): boolean {
        return ultimaResposta.indexOf(text) >= 0
    }

    /**
     * Envia una lectura a l'ESP32 passarel·la local.
     */
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

        if (!enviaAT(cmdStart, "OK", 8000)) {
            basic.showString("E")
            return false
        }

        basic.showString("1")

        let cmdSend = "AT+CIPSEND=" + peticio.length

        if (!enviaAT(cmdSend, ">", 5000)) {
            basic.showString("C")
            return false
        }

        basic.showString("2")

        serial.writeString(peticio)

        if (enviaAT("", "SEND OK", 8000)) {
            basic.showString("S")
            return true
        }

        basic.showString("F")
        return false
    }
}
