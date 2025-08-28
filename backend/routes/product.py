from fastapi import APIRouter, HTTPException
from models.product import product_collection
from schemas.product import Product, ProductCreate, ProductUpdate
from bson import ObjectId

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=list[Product])
def get_products():
    products = list(product_collection.find())
    for p in products:
        p["id"] = str(p["_id"])
    return products

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str):
    product = product_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product["id"] = str(product["_id"])
    return product

@router.post("/", response_model=Product)
def create_product(product: ProductCreate):
    result = product_collection.insert_one(product.dict())
    new_product = product_collection.find_one({"_id": result.inserted_id})
    new_product["id"] = str(new_product["_id"])
    return new_product

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: str, product: ProductUpdate):
    result = product_collection.update_one({"_id": ObjectId(product_id)}, {"$set": product.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated_product = product_collection.find_one({"_id": ObjectId(product_id)})
    updated_product["id"] = str(updated_product["_id"])
    return updated_product

@router.delete("/{product_id}")
def delete_product(product_id: str):
    result = product_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"} 