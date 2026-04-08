from sqlalchemy.orm import Session

from app.models import Activity, HealthArticle, HealthProfile, LifeRecord, StudyContent, User


def init_seed_data(db: Session):
  if not db.query(User).first():
    default_user = User(
      id=1,
      nickname='王阿姨',
      age=67,
      phone='13800000000',
      city='南京市'
    )
    db.add(default_user)
    db.flush()
    db.add(HealthProfile(user_id=1))

  if not db.query(HealthArticle).first():
    db.add_all([
      HealthArticle(
        category='慢病护理',
        title='高血压日常饮食提醒',
        summary='少盐、规律作息、按时测量血压。',
        content='高血压人群建议饮食清淡，减少高盐食物摄入。每天保持规律休息，避免情绪波动，按医嘱监测血压。',
        is_recommended=True
      ),
      HealthArticle(
        category='睡眠健康',
        title='晚上睡不着怎么办',
        summary='睡前少喝浓茶咖啡，保持卧室安静。',
        content='晚饭不宜过饱，睡前 1 小时尽量少看手机。可以听轻音乐、泡脚，帮助身体放松。连续失眠建议及时咨询医生。',
        is_recommended=True
      ),
      HealthArticle(
        category='用药常识',
        title='按时吃药的重要性',
        summary='固定时间服药，有助于稳定病情。',
        content='药物需要在医生建议下规律使用，不要自行增减剂量。漏服后如不确定是否补服，应先咨询医生或药师。'
      ),
      HealthArticle(
        category='运动保健',
        title='适合老年人的轻运动',
        summary='散步、拉伸、八段锦都适合。',
        content='每天进行适量轻运动，有助于保持肌肉力量和关节灵活。运动前后适当补水，身体不适时及时停止。'
      ),
      HealthArticle(
        category='饮食提醒',
        title='天气转暖也要记得补水',
        summary='少量多次喝水，更适合老年人。',
        content='天气变化时，身体更容易忽略口渴信号。建议在早上、午后和晚饭后都补充一些温水。'
      )
    ])

  if not db.query(StudyContent).first():
    db.add_all([
      StudyContent(
        category='常用软件教程',
        title='微信语音和视频通话怎么用',
        summary='学会和家人更方便联系。',
        content='打开微信，进入家人的聊天窗口，点击通话按钮，就可以选择语音或视频通话。网络不好时建议先用语音。',
        duration_minutes=8,
        is_recommended=True
      ),
      StudyContent(
        category='养生攻略',
        title='日常饮食怎么更均衡',
        summary='主食、蔬菜、蛋白质要搭配。',
        content='每天三餐尽量规律，多吃蔬菜水果，少吃过甜、过咸食物。喝水要少量多次。',
        duration_minutes=6,
        is_recommended=True
      ),
      StudyContent(
        category='普法栏目',
        title='遇到消费纠纷怎么办',
        summary='保留凭证，先协商，再求助。',
        content='消费后保留票据和付款记录，出现问题时先与商家协商，必要时求助消费者协会。',
        duration_minutes=7
      ),
      StudyContent(
        category='每日新闻',
        title='今日社区便民信息',
        summary='了解周边服务和天气变化。',
        content='今天社区活动中心下午有健康讲座，附近菜市场部分摊位有惠民优惠，出门前请留意天气变化。',
        duration_minutes=5
      ),
      StudyContent(
        category='反诈防骗',
        title='接到陌生电话先别急着转账',
        summary='不轻信，不透露，不转账。',
        content='凡是让你先转账、先提供验证码的电话，都要提高警惕。拿不准时，可以先联系家人或社区工作人员。',
        duration_minutes=9,
        is_recommended=True
      )
    ])

  if not db.query(Activity).first():
    db.add_all([
      Activity(
        publisher_id=1,
        title='社区八段锦晨练',
        purpose='一起锻炼身体',
        time='2026-04-08 08:00',
        location='社区广场',
        people_count=20,
        description='适合中老年人参加，动作舒缓。',
        audit_status='approved',
        status='open'
      ),
      Activity(
        publisher_id=1,
        title='手机使用小课堂',
        purpose='一起学会常用手机功能',
        time='2026-04-09 15:00',
        location='社区服务中心二楼',
        people_count=30,
        description='教大家使用微信、扫码和常见便民功能。',
        audit_status='approved',
        status='open'
      )
    ])

  if not db.query(LifeRecord).first():
    db.add(
      LifeRecord(
        user_id=1,
        record_type='ledger',
        title='买菜',
        amount=36.5,
        event_date='2026-04-07',
        remark='早市采购',
        status='done'
      )
    )

  db.commit()
