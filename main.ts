// Extensio experimental per Aules que Cremen
// Requereix IoT:bit / ESP8266 i l'extensio ESP8266_IoT d'Elecfreaks.

//% color=#ff6f00 icon="\uf2c9" block="Aules que Cremen"
namespace AulesQueCremen {
    const API_URL = "https://aulesquecremen.cat/api/v1/readings"

    function esc(s: string): string {
        return s.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"")
    }

    function jsonLectura(temperatura: number, humitat: number): string {
        return "{\\\"temperature\\\":" + temperatura + ",\\\"humidity\\\":" + humitat + "}"
    }

    /**
     * Prova si l'ESP8266 pot arribar a l'API per HTTPS. Hauria de retornar 401, 422 o una resposta HTTP si la connexio funciona.
     */
    //% block="prova connexio amb Aules que Cremen"
    //% weight=90
    export function provaConnexio(): void {
        // GET simple per comprovar HTTPS. No envia lectura.
        ESP8266_IoT.sendAT("AT+HTTPCLIENT=2,0,\"" + API_URL + "\",,,2", 3000)
    }

    /**
     * Envia una lectura de prova sense token. Serveix per comprovar si el POST HTTPS amb JSON arriba al servidor.
     * Si arriba, el servidor normalment hauria de respondre 401 per manca de token.
     */
    //% block="prova POST sense token temperatura %temperatura humitat %humitat"
    //% temperatura.defl=22.5
    //% humitat.defl=58
    //% weight=80
    export function provaPostSenseToken(temperatura: number, humitat: number): void {
        let body = jsonLectura(temperatura, humitat)
        let cmd = "AT+HTTPCLIENT=3,1,\"" + API_URL + "\",,,2,\"" + body + "\""
        ESP8266_IoT.sendAT(cmd, 5000)
    }

    /**
     * Intenta enviar una lectura amb token Bearer. Bloc experimental: depen del firmware AT de l'ESP8266.
     */
    //% block="envia a Aules que Cremen token %token temperatura %temperatura humitat %humitat"
    //% token.defl="token"
    //% temperatura.defl=22.5
    //% humitat.defl=58
    //% weight=70
    export function enviaLectura(token: string, temperatura: number, humitat: number): void {
        let body = jsonLectura(temperatura, humitat)

        // Alguns firmwares ESP-AT permeten afegir capçaleres amb AT+HTTPCHEAD.
        // Si el firmware no ho suporta, retornara ERROR, pero igualment provarem el POST.
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=0", 500)
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=1,\"Content-Type: application/json\"", 500)
        ESP8266_IoT.sendAT("AT+HTTPCHEAD=1,\"Authorization: Bearer " + esc(token) + "\"", 500)

        let cmd = "AT+HTTPCLIENT=3,1,\"" + API_URL + "\",,,2,\"" + body + "\""
        ESP8266_IoT.sendAT(cmd, 7000)
    }
}
