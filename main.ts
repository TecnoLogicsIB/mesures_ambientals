//% color=#ff6f00 icon="\uf1eb" block="Aules que Cremen"
namespace AulesQueCremen {

    let ultimaResposta = ""

    function quanArribaSerial(): void {
        ultimaResposta += serial.readString()
    }

    //% block="inicialitza ESP8266 RX %rx TX %tx"
    //% rx.defl=SerialPin.P12
    //% tx.defl=SerialPin.P8
    //% weight=100
    export function initESP8266(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate115200)
        serial.setTxBufferSize(256)
        serial.setRxBufferSize(256)

        serial.onDataReceived(
            serial.delimiters(Delimiters.NewLine),
            quanArribaSerial
        )

        basic.pause(1000)
        ultimaResposta = ""
    }

    //% block="envia AT %cmd"
    //% cmd.defl="AT"
    //% weight=90
    export function sendAT(cmd: string): void {
        ultimaResposta = ""
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
            if (ultimaResposta.indexOf(txt) >= 0) {
                return true
            }
            basic.pause(20)
        }

        return false
    }
}
