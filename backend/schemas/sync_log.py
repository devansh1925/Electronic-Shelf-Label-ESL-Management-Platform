from pydantic import BaseModel
from typing import Optional

class SyncLogBase(BaseModel):
    eslId: str
    productName: str
    gatewayId: str
    storeName: str
    status: str
    syncedAt: str
    errorMessage: Optional[str] = None
    duration: str

class SyncLogCreate(SyncLogBase):
    pass

class SyncLogUpdate(SyncLogBase):
    pass

class SyncLogInDB(SyncLogBase):
    id: str

class SyncLog(SyncLogInDB):
    pass 