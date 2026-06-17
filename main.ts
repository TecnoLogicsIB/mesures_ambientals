// Extensio per Aules que Cremen
// micro:bit + IoT:bit / ESP8266 -> ESP32 passarel·la local

//% color=#ff6f00 icon="\uf1eb" block="Aules que Cremen"
namespace AulesQueCremen {

    let ultimaResposta = ""

    function llegirSerial(): string {
        let resposta = ""
        let tros = serial.readString()

        if (tros && tros.length > 0) {
            resposta += tros
        }

        return resposta
    }

    function buidaSerial(): void {
        serial.readString()
        ultimaResposta = ""
    }

    //% block="inicialitza ESP8266 RX %rx TX %tx"
    //% rx.defl=SerialPin.P12
    //% tx.defl=SerialPin.P8
    //% weight=100
    export function initESP8266(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate115200)
        serial.setTxBufferSize(256)
        serial.setRxBufferSize(256)
        basic.pause(1000)
        buidaSerial()
    }

    //% block="envia AT %cmd"
    //% cmd.defl="AT"
    //% weight=90
    export function sendAT(cmd: string): void {
        buidaSerial()
        serial.writeString(cmd + "\r\n")
    }

    //% block="envia RAW %txt"
    //% weight=80
    export function sendRaw(txt: string): void {
        serial.writeString(txt)
    }

    //% block="resposta ESP8266"
    //% weight=70
    export function response(): string {
        return ultimaResposta
    }

    //% block="espera %txt durant %timeout ms"
    //% txt.defl="OK"
    //% timeout.defl=3000
    //% weight=60
    export function waitFor(txt: string, timeout: number): boolean {
        let inici = input.runningTime()

        while (input.runningTime() - inici < timeout) {
            let tros = llegirSerial()

            if (tros.length > 0) {
                ultimaResposta += tros
            }

            if (ultimaResposta.indexOf(txt) >= 0) {
                return true
            }

            basic.pause(20)
        }

        return false
    }
}
