from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from repository_sqlalchemy import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_type = Column(String(20), nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)

    def __repr__(self):
        return (
            f"<Subscription("
            f"id={self.id}, "
            f"user_id={self.user_id}, "
            f"plan_type='{self.plan_type}', "
            f"start_date='{self.start_date}', "
            f"end_date='{self.end_date}'"
            f")>"
        )
