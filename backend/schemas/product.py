from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    barcode: str
    mrp: float
    discount: Optional[float] = 0.0
    sellingPrice: float
    category: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class ProductInDB(ProductBase):
    id: str

class Product(ProductInDB):
    pass 