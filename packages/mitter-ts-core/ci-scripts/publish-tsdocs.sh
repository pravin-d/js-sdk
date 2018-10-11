#!/bin/bash

echo "[default]" >> ~/.aws/credentials
echo "aws_access_key_id = ${S3_DOCS_PUBLISH_ACCESS_KEY}" >> ~/.aws/credentials
echo "aws_secret_access_key = ${S3_DOCS_PUBLISH_ACCESS_SECRET}" >> ~/.aws/credentials

yarn run s3p sync -y docs/ s3://mitter-sourcedocs/tsdocs/core/`npm list null | head -n1 | cut -d'@' -f3 | cut -d' ' -f1

