# Aules que Cremen - MakeCode micro:bit / IoT:bit

Extensio experimental per provar enviament de lectures a Aules que Cremen amb micro:bit + IoT:bit / ESP8266.

Primer cal connectar el Wi-Fi amb els blocs de `ESP8266_IoT`.

Blocs principals:

- `prova Aules que Cremen sense token`: prova si l'ESP8266 pot fer el POST a l'API. Si arriba al servidor, hauria de retornar 401.
- `envia Aules que Cremen token`: prova experimental amb capcalera Authorization Bearer.
