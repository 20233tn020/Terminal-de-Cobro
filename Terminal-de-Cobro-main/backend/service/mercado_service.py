import requests
import time
BASE_URL = "https://api.coingecko.com/api/v3"


# 🔹 Lista de criptos




cache_data = None
cache_time = 0

def obtener_activos():
    global cache_data, cache_time

    # 🔥 si pasaron menos de 30s → usa cache
    if time.time() - cache_time < 30 and cache_data:
        print("USANDO CACHE")
        return cache_data

    try:
        url = f"{BASE_URL}/coins/markets"
        params = {
            "vs_currency": "usd",
            "order": "market_cap_desc",
            "per_page": 50,
            "page": 1,
            "sparkline": "false"
        }

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, params=params, headers=headers)

        if response.status_code != 200:
            print("RATE LIMIT:", response.status_code)
            return cache_data or []

        data = response.json()

        # 🔥 guardar en cache
        cache_data = data
        cache_time = time.time()

        return data

    except Exception as e:
        print("ERROR:", e)
        return cache_data or []

# 🔹 Detalles
def obtener_detalles(coin_id):
    url = f"{BASE_URL}/coins/{coin_id}"
    response = requests.get(url)
    data = response.json()

    # 🔥 FILTRAR SOLO LO NECESARIO
    return {
        "nombre": data.get("name"),
        "simbolo": data.get("symbol"),
        "imagen": data.get("image", {}).get("large"),

        "precio": data.get("market_data", {}).get("current_price", {}).get("usd"),
        "rank": data.get("market_cap_rank"),

        "high_24h": data.get("market_data", {}).get("high_24h", {}).get("usd"),
        "low_24h": data.get("market_data", {}).get("low_24h", {}).get("usd"),

        "cambio_24h": data.get("market_data", {}).get("price_change_percentage_24h"),

        "descripcion": data.get("description", {}).get("es", "")[:200]  # opcional recortar
    }



# 🔹 Historial

# 🔥 cache global
cache_historial = {}
cache_time_historial = {}

def obtener_historial(coinId, days):
    global cache_historial, cache_time_historial

    key = f"{coinId}_{days}"

    # 🔥 si hay cache y no ha pasado tiempo → usarlo
    if key in cache_historial:
        if time.time() - cache_time_historial[key] < 30:
            print("USANDO CACHE HISTORIAL")
            return cache_historial[key]

    try:
        url = f"{BASE_URL}/coins/{coinId}/market_chart"
        params = {
            "vs_currency": "usd",
            "days": days
        }

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, params=params, headers=headers)

        if response.status_code != 200:
            print("ERROR HISTORIAL:", response.status_code)
            return cache_historial.get(key, {"prices": []})

        data = response.json()

        # 🔥 guardar cache
        cache_historial[key] = data
        cache_time_historial[key] = time.time()

        return data

    except Exception as e:
        print("ERROR:", e)
        return cache_historial.get(key, {"prices": []})
