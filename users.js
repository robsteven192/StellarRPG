// User module
// Hook up to dynamoDB for user database
const AWS = require("aws-sdk");
const Promise = require('promise');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

const tableName = "StellarCharacters";
const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
var params = {
    TableName: tableName,
    KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

// Delete any existing table for testing purposes
dynamodb.deleteTable({ TableName: tableName }, function (err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }

    dynamodb.createTable(params, function (err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
});

// Functions --------------------------------------
setupNewUser = function (author) {
    var params = {
        TableName: tableName,
        Item: {
            "userId": author.id,
            "info": {
                name: author.username,
                commandTimestamps: {},
                inventory: {
                    "Credits": 100,
                    "Pickaxe": 1,
                    "Padded_Lurna_Top": 1,
                    "Padded_Lurna_Bottom": 1,
                    "Padded_Lurna_Boots": 1,
                    "Flickering_Light_Dagger": 1
                },
                level: 10
            }
        }
    }
    return new Promise(function (resolve, reject) {
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                resolve(null);
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                resolve(author.username);
            }
        });
    });
};

getUser = function (userId) {
    var params = {
        TableName: tableName,
        Key: {
            "userId": userId
        }
    };
    return new Promise(function (resolve, reject) {
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                resolve(null);
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                if (data.Item == null) {
                    resolve(null);
                } else {
                    resolve(data.Item.info);
                }
            }
        });
    });
};

updateUserCommandTimeStamp = function (request) {
    var params = {
        TableName: tableName,
        Key: {
            "userId": request.userId
        },
        UpdateExpression: "set info.commandTimestamps = :c",
        ExpressionAttributeValues: {
            ":c": request.user.commandTimestamps
        },
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(params, function (err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
};

module.exports = {
    setupNewUser: setupNewUser,
    getUser: getUser,
    updateUserCommandTimeStamp: updateUserCommandTimeStamp
}