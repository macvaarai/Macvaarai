import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-2_H8Zp7kOMZ", //  pool ID
  ClientId: "5ria262e9ij3i8nhmp47i672qi", // client ID
};

export default new CognitoUserPool(poolData);
