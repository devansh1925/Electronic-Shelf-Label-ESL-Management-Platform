import logging

# Basic configuration
logging.basicConfig(
    level=logging.INFO,  # Use DEBUG for more detailed logs
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
