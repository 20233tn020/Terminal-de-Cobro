import requests

BASE_URL = "https://api.coingecko.com/api/v3"

# 🔹 1. LISTA DE MUCHOS ACTIVOS (como tu lista larga)
def obtener_activos():
    url = f"{BASE_URL}/coins/markets"

    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 50,
        "page": 1,
        "sparkline": False
    }

    response = requests.get(url, params=params)
    data = response.json()

    if not isinstance(data, list):
        print("Error en API:", data)
        return []

    activos = []

    for coin in data:
        cambio = coin.get("price_change_percentage_24h")

        activos.append({
            "symbol": coin["symbol"].upper(),
            "nombre": coin["name"],
            "precio": coin["current_price"],
            "cambio": round(cambio, 2) if cambio is not None else 0
        })

    return activos
def obtener_detalles(coin_id="bitcoin"):
    url = f"{BASE_URL}/coins/{coin_id}"

    response = requests.get(url)
    data = response.json()

    return {
        "nombre": data["name"],
        "precio": data["market_data"]["current_price"]["usd"],
        "market_cap": data["market_data"]["market_cap"]["usd"],
        "volumen": data["market_data"]["total_volume"]["usd"],
        "circulante": data["market_data"]["circulating_supply"],
        "ath": data["market_data"]["ath"]["usd"],
        "ath_change": round(data["market_data"]["ath_change_percentage"]["usd"], 2)
    }
def obtener_historial(coin_id="bitcoin", dias=1):
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"

    params = {
        "vs_currency": "usd",
        "days": dias
    }

    response = requests.get(url, params=params)
    data = response.json()

    precios = [p[1] for p in data["prices"]]

    return precios


# 🔹 Bitcoin principal
def obtener_bitcoin():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"

    response = requests.get(url)
    data = response.json()["bitcoin"]

    return {
        "nombre": "Bitcoin",
        "precio": data["usd"],
        "cambio": round(data.get("usd_24h_change", 0), 2)
    }
