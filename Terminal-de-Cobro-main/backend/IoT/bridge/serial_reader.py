import serial
import requests

# 🔌 puerto (cambia según tu PC)
arduino = serial.Serial('/dev/ttyUSB0', 9600)

while True:
    tarjeta = arduino.readline().decode().strip()

    if tarjeta:
        print("Tarjeta leída:", tarjeta)

        # 🔥 mandar a tu backend
        response = requests.get(
            f"http://127.0.0.1:5000/users/tarjeta/{tarjeta}"
        )

        print(response.json())