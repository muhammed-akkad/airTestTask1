from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from base import Base

class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    surname = Column(String)
    email = Column(String)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'surname': self.surname,
            'email': self.email
        }

class ShopItemCategory(Base):
    __tablename__ = 'shopitemcategories'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description
        }

class ShopItem(Base):
    __tablename__ = 'shopitems'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    price = Column(Float)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price
        }

class OrderItem(Base):
    __tablename__ = 'orderitems'
    id = Column(Integer, primary_key=True)
    shop_item_id = Column(Integer, ForeignKey('shopitems.id'))
    quantity = Column(Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'shop_item_id': self.shop_item_id,
            'quantity': self.quantity
        }

class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id
        }
