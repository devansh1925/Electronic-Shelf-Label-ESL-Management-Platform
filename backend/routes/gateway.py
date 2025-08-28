from fastapi import APIRouter, HTTPException
from models.gateway import gateway_collection
from schemas.gateway import Gateway, GatewayCreate, GatewayUpdate
from bson import ObjectId

router = APIRouter(prefix="/gateways", tags=["Gateways"])

@router.get("/", response_model=list[Gateway])
def get_gateways():
    gateways = list(gateway_collection.find())
    formatted_gateways = []
    for g in gateways:
        g["id"] = str(g["_id"])
        del g["_id"]
        formatted_gateways.append(g)
    return formatted_gateways

@router.get("/{gateway_id}", response_model=Gateway)
def get_gateway(gateway_id: str):
    gateway = gateway_collection.find_one({"_id": ObjectId(gateway_id)})
    if not gateway:
        raise HTTPException(status_code=404, detail="Gateway not found")
    gateway["id"] = str(gateway["_id"])
    del gateway["_id"]
    return gateway

@router.post("/", response_model=Gateway)
def create_gateway(gateway: GatewayCreate):
    result = gateway_collection.insert_one(gateway.dict())
    new_gateway = gateway_collection.find_one({"_id": result.inserted_id})
    new_gateway["id"] = str(new_gateway["_id"])
    del new_gateway["_id"]
    return new_gateway

@router.put("/{gateway_id}", response_model=Gateway)
def update_gateway(gateway_id: str, gateway: GatewayUpdate):
    result = gateway_collection.update_one({"_id": ObjectId(gateway_id)}, {"$set": gateway.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Gateway not found")
    updated_gateway = gateway_collection.find_one({"_id": ObjectId(gateway_id)})
    updated_gateway["id"] = str(updated_gateway["_id"])
    del updated_gateway["_id"]
    return updated_gateway

@router.delete("/{gateway_id}")
def delete_gateway(gateway_id: str):
    result = gateway_collection.delete_one({"_id": ObjectId(gateway_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gateway not found")
    return {"message": "Gateway deleted"} 