import os 
import boto3
from botocore.client import Config

def get_s3():
    endpoint = os.getenv("S3_ENDPOINT", "http://minio:9000")
    access_key = os.getenv("S3_ACCESS_KEY", "minioadmin")
    secret_key = os.getenv("S3_SECRET_KEY", "minioadmin123")
    region = os.getenv("S3_REGION", "us-east-1")
    force_path = os.getenv("S3_FORCE_PATH_STYLE", "true").lower() == "true"

    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
        config=Config(signature_version="s3v4", s3={"force_path_style": force_path}),
    )

