// Extensio experimental per Aules que Cremen
// Requereix IoT:bit / ESP8266 i l'extensio ESP8266_IoT d'Elecfreaks.

//% color=#ff6f00 icon="\uf2c9" block="Aules que Cremen"
namespace AulesQueCremen {

    function apiUrl(): string {
        return "https://aulesquecremen.cat/api/v1/readings"
    }

    function jsonLectura(temperatura: number, humitat: number): string {
        return "{\"temperature\":" + temperatura + ",\"humidity\":" + humitat + "}"
    }

    function escriuHeader(header: string): void {
        ESP8266_IoT.sendRequest("AT+HTTPCHEAD=" + header.length, ">", 1000)
        serial.writeString(header)
        basic.pause(500)
    }

    /**
     * Envia una lectura de prova a Aules que Cremen sense token.
     * Si el servidor rep la peticio, hauria de respondre error 401.
     */
    //% block="prova Aules que Cremen sense token temperatura %temperatura humitat %humitat"
    //% temperatura.defl=22.5
    //% humitat.defl=58
    //% weight=90
    export function provaSenseToken(temperatura: number, humitat: number): void {
        let body = jsonLectura(temperatura, humitat)
        let cmd = "AT+HTTPCLIENT=3,1,\"" + apiUrl() + "\",,,2,\"" + body + "\""
        ESP8266_IoT.sendRequest(cmd, "OK", 12000)
    }

    /**
     * Envia una lectura a Aules que Cremen amb token Bearer.
     * Bloc experimental: depen del firmware AT de l'ESP8266 de la IoT:bit.
     */
    //% block="envia Aules que Cremen token %token temperatura %temperatura humitat %humitat"
    //% token.defl="token"
    //% temperatura.defl=22.5
    //% humitat.defl=58
    //% weight=80
    export function enviaAmbToken(token: string, temperatura: number, humitat: number): void {
        let body = jsonLectura(temperatura, humitat)

        // Neteja i afegeix capcaleres HTTP. Aquesta sintaxi depen del firmware ESP-AT.
        ESP8266_IoT.sendRequest("AT+HTTPCHEAD=0", "OK", 1000)
        escriuHeader("Content-Type: application/json")
        escriuHeader("Authorization: Bearer " + token)

        let cmd = "AT+HTTPCLIENT=3,1,\"" + apiUrl() + "\",,,2,\"" + body + "\""
        ESP8266_IoT.sendRequest(cmd, "OK", 15000)
    }
}
