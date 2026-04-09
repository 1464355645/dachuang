import base64
import time
import uuid
from pathlib import Path

import requests

from app.core.config import settings


def split_sentences(text: str):
  normalized = (text or '').replace('\r', '\n').strip()
  if not normalized:
    return []

  parts = []
  buffer = []
  for char in normalized:
    buffer.append(char)
    if char in '。！？；\n':
      sentence = ''.join(buffer).strip()
      if sentence:
        parts.append(sentence)
      buffer = []

  tail = ''.join(buffer).strip()
  if tail:
    parts.append(tail)

  merged = []
  for part in parts:
    if merged and len(part) < 8:
      merged[-1] = f'{merged[-1]}{part}'
      continue
    merged.append(part)
  return merged


def _auth_headers(api_key: str):
  if not api_key:
    return {}
  return {'Authorization': f'Bearer {api_key}'}


def _save_audio_bytes(audio_bytes: bytes, suffix='.mp3'):
  Path(settings.static_dir).mkdir(parents=True, exist_ok=True)
  filename = f'voice_{uuid.uuid4().hex}{suffix}'
  file_path = Path(settings.static_dir) / filename
  file_path.write_bytes(audio_bytes)
  return f'/static/{filename}'


def save_uploaded_audio(file_bytes: bytes, filename: str = ''):
  suffix = Path(filename).suffix or '.mp3'
  Path(settings.static_dir).mkdir(parents=True, exist_ok=True)
  saved_name = f'asr_{uuid.uuid4().hex}{suffix}'
  file_path = Path(settings.static_dir) / saved_name
  file_path.write_bytes(file_bytes)
  return {
    'file_path': str(file_path),
    'relative_url': f'/static/{saved_name}'
  }


def _extract_chat_text(payload: dict):
  choices = payload.get('choices') or []
  if choices:
    message = choices[0].get('message') or {}
    content = message.get('content')
    if isinstance(content, str):
      return content.strip()
    if isinstance(content, list):
      text_parts = []
      for item in content:
        if isinstance(item, dict) and item.get('type') == 'text':
          text_parts.append(item.get('text', ''))
      return ''.join(text_parts).strip()

  output = payload.get('output') or {}
  if isinstance(output, dict):
    text = output.get('text') or output.get('outputText')
    if text:
      return str(text).strip()

  data = payload.get('data') or {}
  if isinstance(data, dict):
    text = data.get('text') or data.get('content')
    if text:
      return str(text).strip()
  return ''


def generate_chat_reply(message: str, context: str = ''):
  prompt = (message or '').strip()
  if not prompt:
    return '您好，请告诉我您想了解什么，我会用简单的话慢慢说。'

  if settings.voice_provider == 'mock' or not settings.llm_api_url:
    context_tip = f'当前页面内容：{context}。' if context else ''
    return (
      f'{context_tip}您刚才问的是：{prompt}。'
      '我建议先按页面提示一步一步操作，如果看到挂号、缴费、学习这些入口，轻点进入即可。'
      '如果是身体持续不舒服，请尽快联系家人或去医院。'
    )

  payload = {
    'model': settings.llm_model,
    'messages': [
      {'role': 'system', 'content': settings.llm_system_prompt},
      {'role': 'user', 'content': f'页面参考：{context}\n用户问题：{prompt}' if context else prompt}
    ],
    'temperature': 0.4
  }
  response = requests.post(
    settings.llm_api_url,
    headers={
      'Content-Type': 'application/json',
      **_auth_headers(settings.llm_api_key)
    },
    json=payload,
    timeout=25
  )
  response.raise_for_status()
  text = _extract_chat_text(response.json())
  return text or '您好，我刚才没有听清内容，您可以再说得短一点。'


def synthesize_speech(text: str):
  content = (text or '').strip()
  if not content:
    return {'audioUrl': settings.mock_audio_url, 'provider': settings.voice_provider or 'mock'}

  if settings.voice_provider == 'mock' or not settings.tts_api_url:
    return {'audioUrl': settings.mock_audio_url, 'provider': 'mock'}

  payload = {
    'model': settings.tts_model,
    'input': {
      'text': content,
      'voice': settings.tts_voice,
      'format': 'mp3',
      'sample_rate': 24000
    }
  }
  response = requests.post(
    settings.tts_api_url,
    headers={
      'Content-Type': 'application/json',
      **_auth_headers(settings.tts_api_key)
    },
    json=payload,
    timeout=40
  )
  response.raise_for_status()
  data = response.json()

  output = data.get('output') or {}
  audio = output.get('audio') or {}
  audio_url = audio.get('url')
  if not audio_url:
    audio_url = data.get('audioUrl') or data.get('audio_url')
  if not audio_url and isinstance(data.get('data'), dict):
    audio_url = data['data'].get('audioUrl') or data['data'].get('audio_url')
  if audio_url:
    return {'audioUrl': audio_url, 'provider': settings.voice_provider}

  audio_base64 = audio.get('data') or data.get('audioBase64') or data.get('audio_base64')
  if not audio_base64 and isinstance(data.get('data'), dict):
    audio_base64 = data['data'].get('audioBase64') or data['data'].get('audio_base64')
  if audio_base64:
    audio_bytes = base64.b64decode(audio_base64)
    local_url = _save_audio_bytes(audio_bytes)
    return {'audioUrl': local_url, 'provider': settings.voice_provider}

  return {'audioUrl': settings.mock_audio_url, 'provider': settings.voice_provider}


def _extract_dashscope_transcript(result_payload: dict):
  transcripts = result_payload.get('transcripts') or []
  if transcripts:
    first = transcripts[0] or {}
    text = first.get('text')
    if text:
      return text.strip()
    sentences = first.get('sentences') or []
    sentence_text = ''.join([(item or {}).get('text', '') for item in sentences]).strip()
    if sentence_text:
      return sentence_text
  return ''


def transcribe_audio(file_url: str):
  if settings.voice_provider == 'mock' or not settings.asr_api_url:
    return '帮我用语音助手读一读当前页面。'

  submit_response = requests.post(
    settings.asr_api_url,
    json={
      'model': settings.asr_model,
      'input': {
        'file_urls': [file_url]
      },
      'parameters': {
        'language_hints': ['zh']
      }
    },
    headers={
      **_auth_headers(settings.asr_api_key),
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable'
    },
    timeout=40
  )
  submit_response.raise_for_status()
  task_id = ((submit_response.json().get('output') or {}).get('task_id') or '').strip()
  if not task_id:
    return ''

  query_url = settings.asr_query_url.format(task_id=task_id)
  for _ in range(80):
    query_response = requests.post(
      query_url,
      headers={
        **_auth_headers(settings.asr_api_key),
        'Content-Type': 'application/json'
      },
      timeout=20
    )
    query_response.raise_for_status()
    output = (query_response.json().get('output') or {})
    task_status = output.get('task_status')
    if task_status == 'SUCCEEDED':
      results = output.get('results') or []
      if not results:
        return ''
      result = results[0] or {}
      transcription_url = result.get('transcription_url')
      if not transcription_url:
        return ''
      transcript_response = requests.get(transcription_url, timeout=20)
      transcript_response.raise_for_status()
      return _extract_dashscope_transcript(transcript_response.json())
    if task_status not in ['RUNNING', 'PENDING']:
      return ''
    time.sleep(0.2)
  return ''
