from pydantic import BaseModel, Field


class MockLoginIn(BaseModel):
  nickname: str
  age: int | None = None
  phone: str | None = None
  city: str | None = None


class UpdateUserIn(BaseModel):
  nickname: str | None = None
  age: int | None = None
  phone: str | None = None
  city: str | None = None
  avatarUrl: str | None = None


class MedicationCreateIn(BaseModel):
  medicineName: str
  time: str
  frequency: str
  dosage: str | None = None
  notes: str | None = None
  status: str | None = 'active'


class MedicationUpdateIn(BaseModel):
  medicineName: str | None = None
  time: str | None = None
  frequency: str | None = None
  dosage: str | None = None
  notes: str | None = None
  status: str | None = None


class DiscomfortQueryIn(BaseModel):
  symptom: str | None = None
  symptomType: str | None = None
  detail: str | None = None


class HealthArticleActionIn(BaseModel):
  action: str = Field(pattern='^(read|favorite)$')
  value: bool | None = None


class OutpatientAppointmentIn(BaseModel):
  name: str
  phone: str
  patientName: str
  departmentName: str
  doctorName: str
  date: str
  timeSlot: str
  notes: str | None = None


class CheckupAppointmentIn(BaseModel):
  name: str
  phone: str
  packageName: str
  date: str
  timeSlot: str
  notes: str | None = None


class StudyRecordIn(BaseModel):
  contentId: int
  progress: int
  status: str


class LearningActionIn(BaseModel):
  action: str = Field(pattern='^(read|favorite)$')
  value: bool | None = None


class ActivityCreateIn(BaseModel):
  title: str
  purpose: str
  time: str
  location: str
  peopleCount: int | None = None
  description: str | None = None


class LifeRecordCreateIn(BaseModel):
  recordType: str
  serviceName: str | None = None
  title: str
  amount: float | None = 0
  eventDate: str | None = None
  remark: str | None = None
  status: str | None = 'submitted'


class LifeRecordUpdateIn(BaseModel):
  serviceName: str | None = None
  title: str | None = None
  amount: float | None = None
  eventDate: str | None = None
  remark: str | None = None
  status: str | None = None
