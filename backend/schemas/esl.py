from pydantic import BaseModel
from typing import Optional

class ESLBase(BaseModel):
    labelSize: str
    batteryLevel: int
    signalStrength: int
    status: str
    productName: str
    storeName: str
    lastSync: Optional[str] = None
    isRecentlySync: Optional[bool] = False

class ESLCreate(ESLBase):
    pass

class ESLUpdate(ESLBase):
    pass

class ESLInDB(ESLBase):
    id: str

class ESL(ESLInDB):
    pass 