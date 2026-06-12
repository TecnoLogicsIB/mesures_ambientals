# Mesures ambientals - MakeCode micro:bit / IoT:bit

Extensio experimental per provar si una micro:bit amb IoT:bit / ESP8266 pot enviar lectures a una plataforma IoT.

## Blocs

- `prova connexio amb Aules que Cremen`
- `prova POST sense token temperatura humitat`
- `envia a Aules que Cremen token temperatura humitat`

## Ús de prova

1. Afegeix aquesta extensio a MakeCode des de GitHub.
2. Afegeix també els blocs de `ESP8266_IoT`.
3. Inicialitza l'ESP8266 amb RX P8, TX P12, 115200.
4. Connecta a la Wi-Fi.
5. Executa primer `prova POST sense token`.
6. Si el servidor respon, prova `envia a Aules que Cremen` amb el token real.

## Estat

Experimental. El punt critic es si el firmware ESP-AT de la IoT:bit permet HTTPS i capçaleres HTTP personalitzades.
