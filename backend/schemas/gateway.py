from pydantic import BaseModel
from typing import Optional

class GatewayBase(BaseModel):
    storeName: str
    storeId: str
    ipAddress: str
    firmwareVersion: str
    lastHeartbeat: str
    status: str
    syncCount: int
    errorCount: int
    uptime: str

class GatewayCreate(GatewayBase):
    pass

class GatewayUpdate(GatewayBase):
    pass

class GatewayInDB(GatewayBase):
    id: str

class Gateway(GatewayInDB):
    pass 