// Extensio experimental per Aules que Cremen
// Requereix IoT:bit / ESP8266 i l'extensio ESP8266_IoT d'Elecfreaks.

//% color=#ff6f00 icon="\uf2c9" block="Aules que Cremen"
namespace AulesQueCremen {
    const API_URL = "https://aulesquecremen.cat/api/v1/readings"
    let ultimaResposta = ""

    function esc(s: string): string {
        return s.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"")
    }

    function jsonLectura(temperatura: number, humitat: number): string {
        return "{\\\"temperature\\\":" + temperatura + ",\\\"humidity\\\":" + humitat + "}"
    }

    function desaResposta(res: string): boolean {
        if (res == null) {
            ultimaResposta = "sense resposta"
            return false
        } else {
            ultimaResposta = res
            return true
        }
    }

    /**
     * Retorna l'ultima resposta rebuda de l'ESP8266.
     */
    //% block="ultima resposta Aules que Cremen"
    //% weight=60
    export function resposta(): string {
        return ultimaResposta
    }

    /**
     * Prova basica: comprova si l'ESP8266 respon a AT.
     */
    //% block="prova ESP8266 respon"
    //% weight=100
    export function provaESP8266(): boolean {
        let res = ESP8266_IoT.sendRequest("AT", "OK", 2000)
        return desaResposta(res)
    }

    /**
     * Prova si l'ESP8266 pot arribar a l'API per HTTPS. No envia lectura.
     */
    //% block="prova connexio amb Aules que Cremen"
    //% weight=90
    export function provaConnexio(): boolean {
        let cmd = "AT+HTTPCLIENT=2,0,\"" + API_URL + "\",,,2"
        let res = ESP8266_IoT.sendRequest(cmd, "+HTTPCLIENT", 8000)
        return desaResposta(res)
    }

    /**
     * Envia una lectura de prova sense token. Si arriba al servidor, probablement retornara 401.
     */
    //% block="prova POST sense token temperatura %temperatura humitat %humitat"
    //% temperatura.defl=22.5
    //% humitat.defl=58
    //% weight=80
    export function provaPostSenseToken(temperatura: number, humitat: number): boolean {
        let body = jsonLectura(temperatura, humitat)
        let cmd = "AT+HTTPCLIENT=3,1,\"" + API_URL + "\",,,2,\"" + body + "\""
        let res = ESP8266_IoT.sendRequest(cmd, "+HTTPCLIENT", 10000)
        return desaResposta(res)
    }

    /**
     * Intenta enviar una lectura amb token Bearer. Bloc experimental: depen del firmware AT de l'ESP8266.
     */
    //% block="envia a Aules que Cremen token %token temperatura %temperatura humitat %humitat"
    //% token.defl="token"
    //% temperatura.defl=22.5
    //% humitat.defl=58
    //% weight=70
    export function enviaLectura(token: string, temperatura: number, humitat: number): boolean {
        let body = jsonLectura(temperatura, humitat)

        // Intentem afegir capcaleres HTTP. Si el firmware no ho suporta, aquesta part pot fallar.
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=0", 500)
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=1,\"Content-Type: application/json\"", 500)
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=1,\"Authorization: Bearer " + esc(token) + "\"", 500)

        let cmd = "AT+HTTPCLIENT=3,1,\"" + API_URL + "\",,,2,\"" + body + "\""
        let res = ESP8266_IoT.sendRequest(cmd, "+HTTPCLIENT", 12000)
        return desaResposta(res)
    }
}
