import os


class Settings:
  app_name = '银龄通后端'
  api_prefix = '/api/v1'
  database_url = os.getenv('DATABASE_URL', 'sqlite:///./silver_life.db')
  weather_enabled = os.getenv('WEATHER_ENABLED', 'true').lower() == 'true'
  weather_city = os.getenv('WEATHER_CITY', '南京')
  weather_lat = float(os.getenv('WEATHER_LAT', '32.0603'))
  weather_lon = float(os.getenv('WEATHER_LON', '118.7969'))
  weather_api_url = os.getenv('WEATHER_API_URL', 'https://api.open-meteo.com/v1/forecast')
  static_dir = os.getenv('STATIC_DIR', 'uploads')


settings = Settings()
