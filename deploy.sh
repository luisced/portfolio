#!/bin/bash

# Parameters
REGION="us-east-2"
ACCOUNT_ID="430032500926"
REPOSITORY_NAME="portfolio"
IMAGE_NAME="luisced-portfolio"
CLUSTER_NAME="portfolio"
ECS_PROFILE_NAME="portfolio"
PROJECT_NAME="luisced-portfolio"
VPC_ID="vpc-0e516afdbc3aa6e2b"
SUBNETS="subnet-066d3e1120c054fd7,subnet-02ca1a0915b608cd4"

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &>/dev/null; then
    echo "AWS credentials not configured. Please run 'aws configure' to set up your credentials."
    exit 1
fi

# Authenticate Docker to your Amazon ECR registry
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Create an ECR Repository (if it doesn't already exist)
if ! aws ecr describe-repositories --repository-names $REPOSITORY_NAME --region $REGION &>/dev/null; then
    aws ecr create-repository --repository-name $REPOSITORY_NAME --region $REGION
fi

# Build your Docker image
docker build -t $IMAGE_NAME -f Dockerfile.prod .

# Tag your Docker image
docker tag $IMAGE_NAME:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY_NAME:latest

# Push your Docker image to Amazon ECR
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY_NAME:latest

# Create task definition JSON file
cat <<EOF > task-definition.json
{
    "family": "$PROJECT_NAME",
    "networkMode": "awsvpc",
    "containerDefinitions": [
        {
            "name": "web",
            "image": "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPOSITORY_NAME:latest",
            "portMappings": [
                {
                    "containerPort": 80,
                    "hostPort": 80,
                    "protocol": "tcp"
                }
            ],
            "essential": true
        }
    ],
    "requiresCompatibilities": [
        "FARGATE"
    ],
    "cpu": "256",
    "memory": "512"
}
EOF

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create ECS Cluster
ecs-cli up --cluster-config $CLUSTER_NAME --ecs-profile $ECS_PROFILE_NAME --force

# Create a new ECS service
aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name $PROJECT_NAME \
    --task-definition $PROJECT_NAME \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[],assignPublicIp=ENABLED}"

# Optional: List services to verify deployment
aws ecs list-services --cluster $CLUSTER_NAME
