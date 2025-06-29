from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from base import Base
from models import Customer, ShopItemCategory, ShopItem

engine = create_engine('sqlite:///shop.db')
db_session = scoped_session(sessionmaker(bind=engine))

def init_db():
    Base.metadata.create_all(bind=engine)
    # Initialize test data
    db_session.add(Customer(name="John", surname="Doe", email="john.doe@example.com"))
    db_session.add(ShopItemCategory(title="Electronics", description="Electronic items"))
    db_session.add(ShopItem(title="Laptop", description="A powerful laptop", price=999.99))
    db_session.commit()
