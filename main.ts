//% color=#ff6f00 icon="\uf1eb" block="Aules que Cremen"
namespace AulesQueCremen {

    let strBuf = ""

    function serialDataHandler() {
        strBuf += serial.readString()
    }

    /**
     * Inicialitza l'ESP8266
     */
    //% block="inicialitza ESP8266 RX %rx TX %tx"
    //% rx.defl=SerialPin.P12
    //% tx.defl=SerialPin.P8
    export function initESP8266(rx: SerialPin, tx: SerialPin) {

        serial.redirect(tx, rx, BaudRate.BaudRate115200)

        serial.setTxBufferSize(256)
        serial.setRxBufferSize(256)

        serial.onDataReceived(
            serial.delimiters(Delimiters.NewLine),
            serialDataHandler
        )

        basic.pause(1000)
    }

    /**
     * Envia una comanda AT
     */
    //% block="envia AT %cmd"
    export function sendAT(cmd: string) {

        strBuf = ""

        serial.writeString(cmd + "\r\n")
    }

    /**
     * Envia text cru
     */
    //% block="envia RAW %txt"
    export function sendRaw(txt: string) {

        serial.writeString(txt)
    }

    /**
     * Resposta rebuda
     */
    //% block="resposta ESP8266"
    export function response(): string {

        return strBuf
    }

    /**
     * Espera una resposta
     */
    //% block="espera %txt durant %timeout ms"
    export function waitFor(txt: string, timeout: number): boolean {

        let inici = input.runningTime()

        while (input.runningTime() - inici < timeout) {

            if (strBuf.indexOf(txt) >= 0) {
                return true
            }

            basic.pause(20)
        }

        return false
    }
}
