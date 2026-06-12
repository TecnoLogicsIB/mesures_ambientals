// Extensio experimental per Aules que Cremen
// Requereix IoT:bit / ESP8266 i l'extensio ESP8266_IoT d'Elecfreaks.

//% color=#ff6f00 icon="\uf2c9" block="Aules que Cremen"
namespace AulesQueCremen {
    let ultimaResposta = ""

    function apiUrl(): string {
        return "https://aulesquecremen.cat/api/v1/readings"
    }

    function apiHost(): string {
        return "aulesquecremen.cat"
    }

    function apiPath(): string {
        return "/api/v1/readings"
    }

    function jsonLectura(temperatura: number, humitat: number): string {
        return "{\\\"temperature\\\":" + temperatura + ",\\\"humidity\\\":" + humitat + "}"
    }

    function desa(res: string): boolean {
        if (res && res.length > 0) {
            ultimaResposta = res
            return true
        } else {
            ultimaResposta = "SENSE_RESPOSTA"
            return false
        }
    }

    /**
     * Retorna l'ultima resposta rebuda de l'ESP8266. Es pot mostrar amb "mostra cadena".
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
    //% text.defl="202"
    //% weight=65
    export function respostaConte(text: string): boolean {
        return ultimaResposta.indexOf(text) >= 0
    }

    /**
     * Retorna un codi resumit de l'ultima resposta: 202, 401, 422, 429, 0 si hi ha ERROR, -1 si no ho detecta.
     */
    //% block="codi ultima resposta"
    //% weight=60
    export function codiResposta(): number {
        if (ultimaResposta.indexOf("202") >= 0) return 202
        if (ultimaResposta.indexOf("401") >= 0) return 401
        if (ultimaResposta.indexOf("422") >= 0) return 422
        if (ultimaResposta.indexOf("429") >= 0) return 429
        if (ultimaResposta.indexOf("ERROR") >= 0) return 0
        return -1
    }

    /**
     * Envia una lectura de prova sense token. Si arriba al servidor, probablement retornara 401.
     */
    //% block="prova Aules que Cremen sense token temperatura %temperatura humitat %humitat"
    //% temperatura.defl=22.5
    //% humitat.defl=58
    //% weight=100
    export function provaPostSenseToken(temperatura: number, humitat: number): boolean {
        let body = jsonLectura(temperatura, humitat)
        let cmd = "AT+HTTPCLIENT=3,1,\"" + apiUrl() + "\",\"" + apiHost() + "\",\"" + apiPath() + "\",2,\"" + body + "\""
        let res = ESP8266_IoT.sendRequest(cmd, "+HTTPCLIENT", 20000)
        return desa(res)
    }

    /**
     * Intenta enviar una lectura amb token Bearer. Experimental.
     */
    //% block="envia Aules que Cremen token %token temperatura %temperatura humitat %humitat"
    //% token.defl="token"
    //% temperatura.defl=22.5
    //% humitat.defl=58
    //% weight=90
    export function enviaLectura(token: string, temperatura: number, humitat: number): boolean {
        let body = jsonLectura(temperatura, humitat)

        // Afegim capcaleres HTTP abans del POST.
        // Aquesta part depen del firmware AT que porti la IoT:bit.
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=0", 500)
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=1,\"Content-Type: application/json\"", 500)
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=1,\"Authorization: Bearer " + token + "\"", 500)

        let cmd = "AT+HTTPCLIENT=3,1,\"" + apiUrl() + "\",\"" + apiHost() + "\",\"" + apiPath() + "\",2,\"" + body + "\""
        let res = ESP8266_IoT.sendRequest(cmd, "+HTTPCLIENT", 20000)
        return desa(res)
    }
}
