import pandas as pd
import httpx
import time
from datetime import datetime
from typing import List, Dict
import asyncio
from ratelimit import limits, sleep_and_retry

ONE_MINUTE = 60
MAX_CALLS_PER_MINUTE = 20  # OKX rate limit

@sleep_and_retry
@limits(calls=MAX_CALLS_PER_MINUTE, period=ONE_MINUTE)
async def _make_api_call(url: str) -> Dict:
    """
    Make a rate-limited API call to OKX
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise Exception(f"API call failed: {response.text}")
        return response.json()

async def fetch_okx_data(symbol: str, interval: str, start: str, end: str) -> pd.DataFrame:
    """
    Fetch historical OHLCV data from OKX API with pagination and rate limiting.
    
    Args:
        symbol (str): Trading pair symbol (e.g., 'BTC-USDT')
        interval (str): Candle interval ('1m', '5m', '15m', '1H', '4H', '1D', etc.)
        start (str): Start time in ISO format (e.g., '2023-01-01T00:00:00Z')
        end (str): End time in ISO format (e.g., '2023-12-31T23:59:59Z')
    
    Returns:
        pd.DataFrame: DataFrame with columns [timestamp, open, high, low, close, volume]
    """
    # Convert interval to OKX format
    interval_mapping = {
        '1m': '1m',
        '5m': '5m',
        '15m': '15m',
        '30m': '30m',
        '1h': '1H',
        '4h': '4H',
        '1d': '1D'
    }
    
    if interval not in interval_mapping:
        raise ValueError(f"Unsupported interval: {interval}")
    
    okx_interval = interval_mapping[interval]
    
    # Convert timestamps to Unix timestamp (milliseconds)
    start_ts = int(datetime.fromisoformat(start.replace('Z', '+00:00')).timestamp() * 1000)
    end_ts = int(datetime.fromisoformat(end.replace('Z', '+00:00')).timestamp() * 1000)
    
    base_url = "https://www.okx.com"
    all_candles = []
    
    # OKX returns max 100 candles per request, so we need to paginate
    while start_ts < end_ts:
        url = f"{base_url}/api/v5/market/history-candles?instId={symbol}&bar={okx_interval}&after={start_ts}"
        
        try:
            response = await _make_api_call(url)
            candles = response.get('data', [])
            
            if not candles:
                break
                
            all_candles.extend(candles)
            
            # Update start_ts for next iteration
            # OKX returns data in reverse chronological order
            start_ts = int(candles[-1][0])
            
            # Small delay to prevent hitting rate limits
            await asyncio.sleep(0.1)
            
        except Exception as e:
            raise Exception(f"Error fetching data: {str(e)}")
    
    if not all_candles:
        return pd.DataFrame(columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    
    # Convert to DataFrame
    df = pd.DataFrame(
        all_candles,
        columns=['timestamp', 'open', 'high', 'low', 'close', 'volume', 'volCcy', 'volCcyQuote', 'confirm']
    )
    
    # Keep only required columns and convert types
    df = df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
    
    # Convert types
    df['timestamp'] = pd.to_datetime(df['timestamp'].astype(int), unit='ms')
    for col in ['open', 'high', 'low', 'close', 'volume']:
        df[col] = df[col].astype(float)
    
    # Sort by timestamp in ascending order
    df = df.sort_values('timestamp')
    
    return df

# Example usage:
# async def main():
#     df = await fetch_okx_data(
#         symbol='BTC-USDT',
#         interval='1h',
#         start='2023-01-01T00:00:00Z',
#         end='2023-01-02T00:00:00Z'
#     )
#     print(df.head())
