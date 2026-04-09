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
  voice_provider = os.getenv('VOICE_PROVIDER', 'mock')
  llm_api_url = os.getenv('LLM_API_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions')
  llm_api_key = os.getenv('LLM_API_KEY', os.getenv('DASHSCOPE_API_KEY', ''))
  llm_model = os.getenv('LLM_MODEL', 'qwen-turbo')
  llm_system_prompt = os.getenv(
    'LLM_SYSTEM_PROMPT',
    '你是面向老年人的中文语音助手。请用温和、简短、容易听懂的中文回答。每次只说最重要的2到4点，不要使用复杂术语。涉及医疗风险时提醒及时就医，不替代医生。'
  )
  tts_api_url = os.getenv('TTS_API_URL', 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer')
  tts_api_key = os.getenv('TTS_API_KEY', os.getenv('DASHSCOPE_API_KEY', ''))
  tts_model = os.getenv('TTS_MODEL', 'cosyvoice-v3-flash')
  tts_voice = os.getenv('TTS_VOICE', 'longanyang')
  asr_api_url = os.getenv('ASR_API_URL', 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription')
  asr_query_url = os.getenv('ASR_QUERY_URL', 'https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}')
  asr_api_key = os.getenv('ASR_API_KEY', os.getenv('DASHSCOPE_API_KEY', ''))
  asr_model = os.getenv('ASR_MODEL', 'paraformer-v2')
  public_file_base_url = os.getenv('PUBLIC_FILE_BASE_URL', '')
  mock_audio_url = os.getenv(
    'MOCK_AUDIO_URL',
    'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  )


settings = Settings()
