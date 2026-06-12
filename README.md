# Mesures ambientals - MakeCode micro:bit / IoT:bit

Extensio experimental per provar si una micro:bit amb IoT:bit / ESP8266 pot enviar lectures a Aules que Cremen.

Versio 0.0.3: afegeix blocs de diagnostic i una variable `ultima resposta Aules que Cremen`.

Blocs principals:

- prova ESP8266 respon
- prova connexio amb Aules que Cremen
- prova POST sense token
- envia a Aules que Cremen token temperatura humitat
- ultima resposta Aules que Cremen

Aquesta extensio es experimental. El punt critic es si el firmware AT de l'ESP8266 suporta HTTPS i capcaleres HTTP personalitzades.
