from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import settings
from app.schemas import VoiceChatIn, VoiceReadIn, VoiceReadOut, VoiceTtsIn
from app.services.voice import generate_chat_reply, save_uploaded_audio, split_sentences, synthesize_speech, transcribe_audio

router = APIRouter(prefix='/voice', tags=['voice'])


def success(data=None, message='success'):
  return {'code': 0, 'message': message, 'data': data}


@router.post('/chat')
def voice_chat(payload: VoiceChatIn):
  answer = generate_chat_reply(payload.message, payload.context or '')
  audio = synthesize_speech(answer)
  sentences = split_sentences(answer)
  return success({
    'text': answer,
    'audioUrl': audio['audioUrl'],
    'provider': audio['provider'],
    'sentences': sentences
  })


@router.post('/tts')
def voice_tts(payload: VoiceTtsIn):
  audio = synthesize_speech(payload.text)
  sentences = split_sentences(payload.text)
  return success({
    'text': payload.text,
    'audioUrl': audio['audioUrl'],
    'provider': audio['provider'],
    'sentences': sentences
  })


@router.post('/page-read', response_model=VoiceReadOut)
def voice_page_read(payload: VoiceReadIn):
  text = '\n'.join([item.strip() for item in payload.sections if item and item.strip()])
  audio = synthesize_speech(text)
  sentences = split_sentences(text)
  return VoiceReadOut(
    code=0,
    message='success',
    data={
      'title': payload.title,
      'text': text,
      'audioUrl': audio['audioUrl'],
      'provider': audio['provider'],
      'sentences': sentences
    }
  )


@router.post('/asr')
async def voice_asr(file: UploadFile = File(...)):
  file_bytes = await file.read()
  if not file_bytes:
    raise HTTPException(status_code=400, detail='empty file')
  saved = save_uploaded_audio(file_bytes, file.filename or 'voice.wav')
  text = ''
  if settings.public_file_base_url:
    try:
      public_url = f'{settings.public_file_base_url.rstrip("/")}{saved["relative_url"]}'
      text = transcribe_audio(public_url)
    except Exception:
      text = ''
  return success({
    'text': text or '当前环境还没有公网音频地址，真实语音识别暂时不可用。您可以先手动输入，或把后端部署到公网后再启用。'
  })
