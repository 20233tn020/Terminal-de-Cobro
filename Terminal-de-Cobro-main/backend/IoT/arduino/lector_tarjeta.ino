void setup() {
  Serial.begin(9600);
}

void loop() {
  // Simular lectura de tarjeta
  String tarjeta = "1234567890123456";

  Serial.println(tarjeta); // 🔥 envía a la PC

  delay(5000); // cada 5 segundos
}