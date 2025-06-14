from sqlalchemy import Column, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Collection(Base):
    __tablename__ = "collections"
    id = Column(String, primary_key=True, index=True)
    asset_ids = Column(Text)