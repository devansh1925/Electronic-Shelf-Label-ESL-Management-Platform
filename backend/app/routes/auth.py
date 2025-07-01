from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.users import UserResponse, UserCreate, TokenResponse
from app.models.users import create_user, user_collection
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token
from app.utils.logger import logger


router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    try:
        existing_user = await user_collection.find_one({"email": user.email})
        if existing_user:
            logger.warning(f"Registration attempt with existing email: {user.email}")
            raise HTTPException(status_code=400, detail="Email already exists")

        # Data preparation
        user_data = {
            "email": user.email,
            "password": hash_password(user.password),
            "role": user.role,
        }
        print("User data", user_data)
        new_user = await create_user(user_data)
        print("New user created", new_user)
        return new_user
    except Exception as e:
        logger.error(f"Error during user registration: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail="Something went wrong in user registration"
        )


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):

    try:
        user = await user_collection.find_one({"email": form_data.username})
        if not user or not verify_password(form_data.password, user["password"]):
            raise HTTPException(status_code=501, detail="Invalid Credentials")

        access_token = create_access_token(
            data={"user_id": str(user["_id"]), "email": user["email"]}
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Error during login: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Something went wrong in login")
