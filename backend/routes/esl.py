from fastapi import APIRouter, HTTPException
from models.esl import esl_collection
from schemas.esl import ESL, ESLCreate, ESLUpdate
from bson import ObjectId

router = APIRouter(prefix="/esls", tags=["ESL"])

@router.get("/", response_model=list[ESL])
def get_esls():
    esls = list(esl_collection.find())
    formatted_esls = []
    for e in esls:
        e["id"] = str(e["_id"])
        del e["_id"]
        formatted_esls.append(e)
    return formatted_esls

@router.get("/{esl_id}", response_model=ESL)
def get_esl(esl_id: str):
    esl = esl_collection.find_one({"_id": ObjectId(esl_id)})
    if not esl:
        raise HTTPException(status_code=404, detail="ESL not found")
    esl["id"] = str(esl["_id"])
    del esl["_id"]
    return esl

@router.post("/", response_model=ESL)
def create_esl(esl: ESLCreate):
    result = esl_collection.insert_one(esl.dict())
    new_esl = esl_collection.find_one({"_id": result.inserted_id})
    new_esl["id"] = str(new_esl["_id"])
    del new_esl["_id"]
    return new_esl

@router.put("/{esl_id}", response_model=ESL)
def update_esl(esl_id: str, esl: ESLUpdate):
    result = esl_collection.update_one({"_id": ObjectId(esl_id)}, {"$set": esl.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="ESL not found")
    updated_esl = esl_collection.find_one({"_id": ObjectId(esl_id)})
    updated_esl["id"] = str(updated_esl["_id"])
    del updated_esl["_id"]
    return updated_esl

@router.delete("/{esl_id}")
def delete_esl(esl_id: str):
    result = esl_collection.delete_one({"_id": ObjectId(esl_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="ESL not found")
    return {"message": "ESL deleted"} 