## Setup claudia globally
`npm install claudia -g`

## install packages from package.json
`npm install`

## install awscli using pip3(for python version >= python 3.0)
`pip3 install awscli`

## update package.json to include create/update cluadia 
``` bash
"create": "claudia create --region us-east-2 --api-module api
"update': "claudia update"
```

## setup amazon user in IAM and get access id and secrets key
1. go to AWS console - https://console.aws.amazon.com
2. navigate to the Users tab
3. click on "add user" button
4. specify user name as "claudia"
5. select the "programmatic access option"
6. click the "next permissions" button
7. select "attach existing policies directly" tab
8. select the recommended polcies for this project as "IamFullAccess", "AWSLambdaFullAccess", "AmazonAPIGatewayAdministrator", "AmazonDynamoDBFullAccess", "AmazonAPIGatewayPushToCloudWatchLogs" and "AmazonCognitoPowerUser"
9. click on next button (skip tags)
10. click on review button
11. click on "create user" button
12. copy the access id and secret key

## create credentials and config files
1. create a folder .aws
2. create 2 files in the folder. name them credentials and config
3. place the .aws folder under %Home% directory (ex: "/Users/xxx" where xxx is user name). Here %Home% refers to "/Users/xxx"

## update credentials and config file
1. paste the AWS credentials to the environment variables for access id and secret key in the credentials and config files
2. additionally config file will have AWS region and the output format for messages
3. please note that you can use either default or a named profile. In this project credential and config files had profile as "claudia"

## run claudia create
`npm run create`

## run claudia update after updating the code
`npm run update`

## check post using curl
`curl -i -H "content-type:application/json" -X POST -d '{"pizzaId":5, "address": "100 Smith Street, Xanadu"}' https://vi8yeybnz0.execute-api.us-east-2.amazonaws.com/latest/orders`

## create a table in DynamoDB with a key
`aws dynamodb create-table --table-name pizza-orders \
--attribute-definitions AttributeName=orderId,AttributeType=S \
--key-schema AttributeName=orderId,KeyType=HASH \
--provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
--region us-east-2 \
--query TableDescription.TableArn --output text`

## create Iam role for access to DynamoDB
1. create the DynamoDB.json file with version, statement, action, effect and resources. This specifies what all actions apply to access DynamoDB. It aslo specifies if access is needed for all tables (*)
2. run the following command to setup Iam role
`aws iam put-role-policy \
--role-name awslambda_palyground-executor \
--policy-name PizzaApiDynamoDB \
--policy-document file://./roles/DynamoDB.json`
4. in the above, the --role-name is obtained from the role section of claudia.json file
5. policy name can be any name

## to view all items in dynamodb
`aws dynamodb scan --table-name pizza-orders --region us-east-2 --output json`

## Git commands

### to create develop branch
```git commands
git checkout -b origin/develop
```
### to commit to develop branch
```git commands
git init
git add .
git commit -m "second commit"
git remote add origin https://github.com/vsprakash2003/awslambda_playground.git
git push -u origin origin/develop
```

## Cloud Watch (logs)
### to get the log group
`aws logs describe-log-groups --region us-east-2`

### to search for a log using the aws log filter-log-event
`aws logs filter-log-events --filter='Order is saved' --log-group-name=/aws/lambda/awslambda_palyground --region=us-east-2 --output=json`

### to get just the latest log using filter
`aws logs filter-log-events --filter='Order is saved' --log-group-name=/aws/lambda/awslambda_palyground --query='events[0].message' --region=us-east-2 --output=json`

## XRay
### to setup xray
`aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AWSxrayWriteOnlyAccess --role-name awslambda_palyground-executor --region us-east-2 --output json`

### to update function configuration
`aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AWSxrayWriteOnlyAccess --role-name awslambda_palyground-executor --region us-east-2 --output json`

## Cognito idp
### to create cognito user pool
`aws cognito-idp create-user-pool --pool-name MyPizzeria --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=false,RequireLowercase=false,RequireNumbers=true,RequireSymbols=true}" --username-attributes email --query UserPool.Id --region us-east-2 --output text`

### to create cognito user pool client
`aws cognito-idp create-user-pool-client --user-pool-id us-east-2_hA53B4gRT --client-name MyPizzeriaClient --no-generate-secret --query UserPoolClient.ClientId --region us-east-2 --output text`

