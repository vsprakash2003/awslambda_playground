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

## check order through url
https://vi8yeybnz0.execute-api.us-east-2.amazonaws.com/latest/

## create a table in DynamoDB with a key
`aws dynamodb create-table --table-name pizza-orders --attribute-definitions AttributeName=orderId,AttributeType=S --key-schema AttributeName=orderId,KeyType=HASH --provisioned-throughputReadCapacityUnits=1,WriteCapacityUnits=1 
--region us-east-2 --query TableDescription.TableArn --output text`

## create Iam role for access to DynamoDB
1. create the DynamoDB.json file with version, statement, action, effect and resources. This specifies what all actions apply to access DynamoDB. It aslo specifies if access is needed for all tables (*)
2. run the following command to setup Iam role
`aws iam put-role-policy --role-name awslambda_palyground-executor --policy-name PizzaApiDynamoDB --policy-document file://./roles/DynamoDB.json`
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
1. user to login with email id and password
2. Cognito identity pool is for federated login like login using facebook or google. In our case it will be plain user id and password
3. Cognito identity pool will provide temporary Cognito user pool access in the browser
4. use Cognito user pool to register and authenticate the user. After successful registration/authentication, user pool will provide a JWT token
5. use the JWT token to contact the pizza API to create/modify orders
   
### to create cognito user pool
`aws cognito-idp create-user-pool --pool-name MyPizzeria --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=false,RequireLowercase=false,RequireNumbers=true,RequireSymbols=true}" --username-attributes email --query UserPool.Id --region us-east-2 --output text`

### to create cognito user pool client
`aws cognito-idp create-user-pool-client --user-pool-id us-east-2_hA53B4gRT --client-name MyPizzeriaClient --no-generate-secret --query UserPoolClient.ClientId --region us-east-2 --output text`

where us-east-2_hA53B4gRT is the user pool id

### to create identity pool
`aws cognito-identity create-identity-pool --identity-pool-name MyPizzeria --allow-unauthenticated-identities --cognito-identity-providers ProviderName=cognito-idp.us-east-2.amazonaws.com/us-east-2_hA53B4gRT,ClientId=2mpvcisokgoeud2ajs5oogrfba,ServerSideTokenCheck=false --query IdentityPoolId --region us-east-2 --output text`

### to create roles in the identity pool
1. navigate to https://us-east-2.console.aws.amazon.com/cognito/home?region=us-east-2
2. click on "Manage Identity Pools" button and select the identity pool ex: MyPizzeria
3. click on "create new role" link for unauthenticated role 
4. click "Allow" button in the next screen
5. Cognito creates a new unathenticated role
6. follow above steps for the authenticated role. Cognito will create a new authenticated role
7. click "Save Changes" button at the bottom
8. go to console.aws.amazon.com and select Identity and Access Management(IAM)
9. click on "Roles" menu in the IAM page
10. click on the newly created role for unauthenticated role and copy the Role ARN at the top of the page
11. do the same for the authenticated role

### to set the roles
`aws cognito-identity set-identity-pool-roles --identity-pool-id us-east-2:4e1af2ed-ea4e-4848-a6de-7975e458d1cf --roles authenticated=arn:aws:iam::878765816605:role/Cognito_MyPizzeriaAuth_Role,unauthenticated=arn:aws:iam::878765816605:role/Cognito_MyPizzeriaUnauth_Role --region us-east-2`

### check if unauthorized users are rejected. Should return status:401
`curl -o -s -w ", status: %{http_code}\n" -H "Content-Type: application/json" -X POST -d '{"pizzaId:1, "address:200 Smith Street, Xanadu"}' https://vi8yeybnz0.execute-api.us-east-2.amazonaws.com/latest/orders`

## S3 bucket
### to create S3 bucket
`aws s3 mb s3://my-cute-pizzeria --region us-east-2`
here "my-cute-pizzeria" is the name of S3 bucket

### to create folders in the S3 bucket
1. navigate to https://s3.console.aws.amazon.com/s3/home?region=us-east-2#
2. click on "my-cute-pizzeria bucket"
3. click on "create folder"
4. create 2 folders for images and thumbnails