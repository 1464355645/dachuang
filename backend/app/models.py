from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):
  __tablename__ = 'users'

  id = Column(Integer, primary_key=True, index=True)
  nickname = Column(String(50), nullable=False, index=True)
  avatar_url = Column(String(255), nullable=True)
  age = Column(Integer, nullable=True)
  phone = Column(String(20), nullable=True, index=True)
  city = Column(String(50), nullable=True, index=True)
  created_at = Column(DateTime, default=datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class HealthArticle(Base):
  __tablename__ = 'health_articles'

  id = Column(Integer, primary_key=True, index=True)
  category = Column(String(50), nullable=False, index=True)
  title = Column(String(100), nullable=False, index=True)
  summary = Column(String(255), nullable=False)
  content = Column(Text, nullable=False)
  cover_url = Column(String(255), nullable=True)
  is_recommended = Column(Boolean, default=False)
  status = Column(String(20), default='published', index=True)
  view_count = Column(Integer, default=0)
  created_at = Column(DateTime, default=datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MedicineReminder(Base):
  __tablename__ = 'medicine_reminders'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
  medicine_name = Column(String(100), nullable=False, index=True)
  time = Column(String(20), nullable=False)
  frequency = Column(String(50), nullable=False)
  notes = Column(String(255), nullable=True)
  status = Column(String(20), default='active', index=True)
  created_at = Column(DateTime, default=datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

  user = relationship('User')


class StudyContent(Base):
  __tablename__ = 'study_contents'

  id = Column(Integer, primary_key=True, index=True)
  category = Column(String(50), nullable=False, index=True)
  title = Column(String(100), nullable=False, index=True)
  summary = Column(String(255), nullable=False)
  content = Column(Text, nullable=False)
  duration_minutes = Column(Integer, default=5)
  cover_url = Column(String(255), nullable=True)
  is_recommended = Column(Boolean, default=False)
  status = Column(String(20), default='published', index=True)
  created_at = Column(DateTime, default=datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class StudyRecord(Base):
  __tablename__ = 'study_records'
  __table_args__ = (UniqueConstraint('user_id', 'content_id', name='uniq_user_content'),)

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
  content_id = Column(Integer, ForeignKey('study_contents.id'), nullable=False, index=True)
  progress = Column(Integer, default=0)
  status = Column(String(20), default='in_progress', index=True)
  last_viewed_at = Column(DateTime, default=datetime.utcnow)
  created_at = Column(DateTime, default=datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

  user = relationship('User')
  content = relationship('StudyContent')


class HealthProfile(Base):
  __tablename__ = 'health_profiles'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False, index=True)
  latest_advice = Column(String(255), default='暂无健康建议，您可以先做一次身体不适查询。')
  summary = Column(String(255), default='当前暂无异常记录，可继续保持规律作息。')
  checkup_tip = Column(String(255), default='体检记录功能将在后续版本补充。')
  discomfort_count = Column(Integer, default=0)
  medication_count = Column(Integer, default=0)
  knowledge_read_count = Column(Integer, default=0)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

  user = relationship('User')


class Activity(Base):
  __tablename__ = 'activities'

  id = Column(Integer, primary_key=True, index=True)
  publisher_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
  title = Column(String(100), nullable=False, index=True)
  purpose = Column(String(255), nullable=False)
  time = Column(String(50), nullable=False)
  location = Column(String(100), nullable=False)
  people_count = Column(Integer, nullable=True)
  description = Column(Text, nullable=True)
  audit_status = Column(String(20), default='pending', index=True)
  status = Column(String(20), default='open', index=True)
  enrolled_count = Column(Integer, default=0)
  created_at = Column(DateTime, default=datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

  publisher = relationship('User')


class DiscomfortLog(Base):
  __tablename__ = 'discomfort_logs'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
  symptom = Column(String(50), nullable=False, index=True)
  detail = Column(String(255), nullable=True)
  advice = Column(String(255), nullable=False)
  created_at = Column(DateTime, default=datetime.utcnow)


class HealthArticleInteraction(Base):
  __tablename__ = 'health_article_interactions'
  __table_args__ = (UniqueConstraint('user_id', 'article_id', name='uniq_user_article'),)

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
  article_id = Column(Integer, ForeignKey('health_articles.id'), nullable=False, index=True)
  is_favorite = Column(Boolean, default=False)
  is_read = Column(Boolean, default=True)
  last_read_at = Column(DateTime, default=datetime.utcnow)

  user = relationship('User')
  article = relationship('HealthArticle')


class ActivityEnrollment(Base):
  __tablename__ = 'activity_enrollments'
  __table_args__ = (UniqueConstraint('user_id', 'activity_id', name='uniq_user_activity'),)

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
  activity_id = Column(Integer, ForeignKey('activities.id'), nullable=False, index=True)
  status = Column(String(20), default='enrolled', index=True)
  created_at = Column(DateTime, default=datetime.utcnow)

  user = relationship('User')
  activity = relationship('Activity')


class LifeRecord(Base):
  __tablename__ = 'life_records'

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
  record_type = Column(String(20), nullable=False, index=True)
  service_name = Column(String(100), nullable=True, index=True)
  title = Column(String(100), nullable=False, index=True)
  amount = Column(Float, default=0)
  event_date = Column(String(30), nullable=True, index=True)
  remark = Column(String(255), nullable=True)
  status = Column(String(20), default='submitted', index=True)
  created_at = Column(DateTime, default=datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

  user = relationship('User')
