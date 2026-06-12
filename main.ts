// Extensio experimental per Aules que Cremen
// Requereix IoT:bit / ESP8266 i l'extensio ESP8266_IoT d'Elecfreaks.

//% color=#ff6f00 icon="\uf2c9" block="Aules que Cremen"
namespace AulesQueCremen {

    /**
     * Prova basica: comprova si l'ESP8266 respon a AT.
     */
    //% block="prova ESP8266 respon"
    //% weight=100
    export function provaESP8266(): boolean {
        let res = ESP8266_IoT.sendRequest("AT", "OK", 2000)
        if (res.length > 0) {
            return true
        } else {
            return false
        }
    }
}
