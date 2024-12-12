const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const createError = require("../utils/errorResponse.js");
const app = express();
app.use(bodyParser.json());
const { URLSearchParams } = require("url");
const msal = require("@azure/msal-node");
const { suspendCapacity } = require("../utils/capacity.js");
const { PowerBIDedicatedClient } = require("@azure/arm-powerbidedicated");
const { DefaultAzureCredential } = require("@azure/identity");
const fs = require("fs");
const {
  PowerBIEmbeddedManagementClient,
} = require("@azure/arm-powerbiembedded");
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const { nextTick } = require("process");

exports.getAccessToken = async (req, res, next) => {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("scope", process.env.SCOPE);

  try {
    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error getting token:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({
      message: error.message,
      details: error.response ? error.response.data : null,
    });
  }
};

exports.getEmbedToken = async (req, res, next) => {
  const groupId = req.query.groupId;
  const reportId = req.query.reportId;
  const token = req.query.token;

  const url2 = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;
  const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("scope", process.env.SCOPE);

  try {
    const response = await axios.post(url2, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error getting token:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({
      message: error.message,
      details: error.response ? error.response.data : null,
    });
  }
};

//GET WORKSPACES
exports.getWorkspaces = async (req, res, next) => {
  try {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const token = response?.data?.access_token;
    // const token = req.query.token;
    // return res.status(200).json(token)

    const url = "https://api.powerbi.com/v1.0/myorg/groups";
    const response1 = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status(200).json(response1.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
    // return next(createError.createError(500,"Internal server error"))

    // return next(createError.createError(500,error.response))
  }
};
//GET DATASETS
exports.getDATASETS = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;

    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const response1 = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const token = response1?.data?.access_token;
    //    const token= req.query.token;

    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status(200).json(response.data.value);
  } catch (error) {
    console.error("Error getting datasets:", error);
  }
};

//GET REPORTS
exports.getReports = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;

    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const response1 = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const token = response1?.data?.access_token;
    //    const token= req.query.token;

    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status(200).json(response.data.value);
  } catch (error) {
    console.error("Error getting datasets:", error);
  }
};

//GET REPORTS
exports.getsampleReports = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;
    const token = req.query.token;
    const reportId = req.query.reportId;

    const url = `https://api.powerbi.com/v1.0/myorg/reports/${reportId}`;
    //    return res.json(url)
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status(200).json(response.data.value);
  } catch (error) {
    console.error("Error getting datasets:", error);
  }
};

//GET REPORT DETAIL

// async function fetchReportDetails(workspaceId, reportId, accessToken) {

//     return reportDetails;
//   }

exports.fetchReportDetails = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;

    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const response1 = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const token = response1?.data?.access_token;
    //    const token= req.query.token;
    const reportId = req.query.reportId;

    const response = await axios.get(
      `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error("Error getting datasets:", error);
    return res.status(500).json(error);
  }
};

exports.fetchEmbedToken = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;
    const reportId = req.query.reportId;

    if (!groupId || !reportId) {
      return res.status(400).json({ error: "Missing groupId or reportId" });
    }

    console.log(
      `Fetching embed token for groupId: ${groupId}, reportId: ${reportId}`
    );

    // Generate authentication token
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const response1 = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const token = response1?.data?.access_token;

    if (!token) {
      console.log("Failed to retrieve access token");
      return res.status(400).json({ error: "Failed to retrieve access token" });
    }

    // Generate embed token for paginated report
    const body = {
      accessLevel: "View",
      allowSaveAs: false,
    };

    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;
    console.log(`Requesting embed token from URL: ${url}`);

    const response = await axios.post(url, JSON.stringify(body), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error generating embed token for paginated report:",
      error.response || error.message
    );
    return res
      .status(500)
      .json({ error: error.response.data || error.message });
  }
};

///FETCH Embed token
exports.fetcheEmbedTokenforReports = async (req, res, next) => {
  try {
    const reportId = req.query.reportId;
    const datasetIds = req.query.datasetIds;
    const groupId = req.query.groupId; // Workspace ID
    // const isPaginated= req.query.isPaginated;

    if (!reportId || !groupId || !datasetIds) {
      return next(createError.createError(400, "Missing requered parameter"));
    }

    // Generate authentication token
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const authResponse = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const authToken = authResponse?.data?.access_token;

    if (!authToken) {
      return next(
        createError.createError(400, "Failed to retrieve access token")
      );
    }

    const requestBody = {
      reports: [
        {
          id: reportId,
        },
      ],

      datasets: [
        {
          id: datasetIds,
          xmlaPermissions: "ReadOnly",
        },
      ],

      // datasourceIdentities: [
      //   {
      //     datasources: [
      //       {
      //         datasourceType: "Sql",
      //         connectionDetails: {
      //           server: 'cedarstreetsqlserver.database.windows.net',
      //           database: 'cedardev',
      //         },
      //       },
      //     ],
      //     identityBlob: identityBlob,
      //   },
      // ],
    };

    // Request embed token using V2 endpoint
    const response = await axios.post(
      `https://api.powerbi.com/v1.0/myorg/GenerateToken`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error fetching embed token:",
      error.response || error.message
    );
    // return res.status(500).json({ error: error.response?.data || error.message });
    return next(createError.createError(500, error.response?.data));
  }
};

exports.fetchPaginatedReports = async (req, res, next) => {
  try {
    const reportId = req.query.reportId;
    const datasetIds = req.query.datasetIds;
    const groupId = req.query.groupId; // Workspace ID

    if (!reportId || !groupId) {
      return res.status(400).json({ error: "Missing reportId or groupId" });
    }

    // Generate authentication token
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const authResponse = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const authToken = authResponse?.data?.access_token;

    if (!authToken) {
      return res.status(400).json({ error: "Failed to retrieve access token" });
    }
    // console.log(authToken)
    // // Prepare the request body for V2
    // const requestBody = {
    //   accessLevel: "view" // You may adjust this depending on your requirements
    // };
    const username = "Sqladmin"; // Replace with your actual username
    const password = "Do5i7w&HT668ovmTJ"; // Replace with your actual password

    // Combine them into the credentials string
    const credentials = `${username}:${password}`;

    // Encode the credentials in Base64
    const encodedCredentials = Buffer.from(credentials).toString("base64");
    // const body1 = {
    //   reports: [{ id: reportId }],
    //   targetWorkspaces: [{ id: groupId }],
    //   accessLevel: "View",
    // };
    // // Use encodedCredentials directly as a Base64 string for identityBlob
    // const requestBody = {
    //   // accessLevel: "View",
    //     reports: [
    //         {
    //             id: reportId,
    //         },
    //     ],
    //   //   datasets: [
    //   //     {
    //   //         id: datasetIds,
    //   //     },
    //   // ],

    //     datasourceIdentities: [
    //         {
    //             datasources: [
    //                 {
    //                     datasourceType: "Sql",
    //                     connectionDetails: {
    //                         server: 'cedarstreetsqlserver.database.windows.net',
    //                         database: 'cedardev',
    //                     },
    //                 },
    //             ],
    //             identityBlob: encodedCredentials,  // Use the Base64 string directly
    //         },
    //     ],
    // };

    // Construct identityBlob and encode it in base64
    const identityBlob = Buffer.from(
      JSON.stringify({
        credentialType: "OAuth2",
        token: authToken,
      })
    ).toString("base64");

    // Request embed token using V2 endpoint
    const requestBody = {
      reports: [
        {
          id: reportId,
        },
      ],

      datasets: [
        {
          id: datasetIds,
          xmlaPermissions: "ReadOnly",
        },
      ],

      datasourceIdentities: [
        {
          datasources: [
            {
              datasourceType: "Sql",
              connectionDetails: {
                server: "cedarstreetsqlserver.database.windows.net",
                database: "cedardev",
              },
            },
          ],
          identityBlob: identityBlob,
        },
      ],
    };

    // Request embed token using V2 endpoint
    // const requestBody = {
    //   reports: [
    //     {
    //       id: reportId,
    //     },
    //   ],
    //   datasourceIdentities: [
    //     {
    //       datasources: [
    //         {
    //           datasourceType: "Sql",
    //           connectionDetails: {
    //             server: 'cedarstreetsqlserver.database.windows.net',
    //             database: 'cedardev',
    //           },
    //         },

    //       ],
    //       identityBlob: 'authToken',
    //     },
    //   ],
    // };
    // Request embed token using V2 endpoint
    const response = await axios.post(
      `https://api.powerbi.com/v1.0/myorg/GenerateToken`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const embedToken = response.data.token;

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error fetching embed token:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ error: error.response?.data || error.message });
  }
};

//////Steps to Retrieve Reports for a Specific Dataset

exports.getAllReportsUnderDataset = async (req, res, next) => {
  try {
    const reportId = req.query.reportId;
    const datasetId = req.query.datasetIds;
    const groupId = req.query.groupId;

    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const tokenResponse = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const authToken = tokenResponse.data.access_token;

    if (!authToken) {
      throw new Error("Failed to retrieve access token");
    }

    // Get all reports in the workspace (group)
    const reportsUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports`;
    const reportsResponse = await axios.get(reportsUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const reports = reportsResponse.data.value;

    // return res.json(reports)

    // Filter reports by datasetId
    const reportsForDataset = reports.filter(
      (report) => report.datasetId === datasetId
    );

    return res.json(reportsForDataset);
  } catch (error) {
    return res.json(error);
  }
};

// exports.generateEmbedToken=async(req,res){
//   try {

//   } catch (error) {
//     return res.status(590)

//   }
// }
// exports.fetchPaginatedReports = async (req, res, next) => {
//   try {
//     const reportId = req.query.reportId;
//     const datasetIds = req.query.datasetIds;

//     if (!reportId) {
//       return res.status(400).json({ error: "Missing reportId" });
//     }

//     // Generate authentication token
//     const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
//     const params = new URLSearchParams();
//     params.append("grant_type", "client_credentials");
//     params.append("client_id", process.env.CLIENT_ID);
//     params.append("client_secret", process.env.CLIENT_SECRET);
//     params.append("scope", process.env.SCOPE);

//     const authResponse = await axios.post(tokenUrl, params.toString(), {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
//       },
//     });

//     const authToken = authResponse?.data?.access_token;

//     if (!authToken) {
//       return res.status(400).json({ error: "Failed to retrieve access token" });
//     }

//     // Prepare the request body
//     const requestBody = {
//       reports: [{ id: reportId }],
//       datasets:[{ id: datasetIds}]
//     };

//     // Request embed token
//     const response = await axios.post('https://api.powerbi.com/v1.0/myorg/GenerateToken', requestBody, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     return res.status(200).json(response.data);
//   } catch (error) {
//     console.error("Error fetching embed token:", error.response?.data || error.message);
//     return res.status(500).json({ error: error.response?.data || error.message });
//   }
// };

// exports.fetchPaginatedReports = async (req, res, next) => {

//     try {
//       const groupId =  req.query.groupId;
//       const reportId = req?.query?.reportId;
//       const isPaginated = req?.query?.isPaginated;
//       const datasetIds = req.query.datasetIds; // Check if the report is paginated

//       // return res.json(
//       //   {
//       //     groupId:groupId,
//       //     reportId:reportId,
//       //     isPaginated: isPaginated
//       //   }
//       // )
//       // Get the OAuth2 token
//       const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
//       const params = new URLSearchParams();
//       params.append("grant_type", "client_credentials");
//       params.append("client_id", process.env.CLIENT_ID);
//       params.append("client_secret", process.env.CLIENT_SECRET);
//       params.append("scope", process.env.SCOPE);

//       const response1 = await axios.post(tokenUrl, params.toString(), {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
//         },
//       });
//       const token = response1?.data?.access_token;

//       // Prepare the request body
//       const body = JSON.stringify({
//         accessLevel: "View",
//         allowSaveAs: false,
//       });

//       // const formData = {
//       //   reports: [{ id: reportId }],
//       //   datasets: [{ id: datasetIds }],
//       //   targetWorkspaces: [{ id: groupId }]
//       // };
//       const embedTokenApi = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/rdlreports/${reportId}/GenerateToken`;

//     const  embedTokenApi1 = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/rdlreports/${reportId}/GenerateToken`;
//       // const embedTokenApi = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
//       console.log(`Requesting embed token from URL: ${embedTokenApi}`);

//       const response12 = await axios.post(embedTokenApi, body, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//   console.log("data",response12.data)
//       return res.status(200).json(response12.data);

//       // Choose the appropriate URL based on report type
//       let url;
//       // if (isPaginated) {
//       //   url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/rdlreports/${reportId}/GenerateToken`;
//       // } else {
//       //   url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;
//       // }
//       url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;
//       // Generate the embed token
//       // const response = await axios.post(url, body, {
//       //   headers: {
//       //     Authorization: Bearer ${token},
//       //     "Content-Type": "application/json",
//       //   },
//       // });

//       const response = await axios.post(url, body, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       return res.status(200).json(response.data);
//   } catch (error) {
//     console.error("Error getting report details:", error);
//     return res.status(500).json({ error: error });
//   }
// }

//GET DASHBOARDS
exports.getDashboards = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;

    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const response1 = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const token = response1?.data?.access_token;
    //    const token= req.query.token;

    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/dashboards`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status(200).json(response.data.value);
  } catch (error) {
    console.error("Error getting datasets:", error);
  }
};

//GET LIST OF CAPABILITY

exports.getListOfOfCapability = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;

    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const response1 = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const token = response1?.data?.access_token;
    //    const token= req.query.token;
    const url = "https://api.powerbi.com/v1.0/myorg/capacities";
    //    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/dashboards`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status(200).json(response.data.value);
  } catch (error) {
    console.error("Error getting datasets:", error);
  }
};

//PAUSE CAPABILITY
exports.suspend1Capacity = async (req, res, next) => {
  try {
    const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.TENANT_ID,
      {
        tokenAudience: "https://management.azure.com/",
      }
    );

    const token = creds?.tokenCache?._entries[0]?.accessToken;
    const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}?api-version=${process.env.APPVERSION}`;
    const statusUrl = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/suspend?api-version=${process.env.APPVERSION}`;
    const statusResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const capacityStataus = statusResponse?.data?.properties?.state;
    // return res.json(capacityStataus)

    if (capacityStataus === "Active") {
    }

    // const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.PowerBIDedicated/capacities/${dedicatedCapacityName}/suspend?api-version=2022-07-01-preview`;
    // const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.PowerBIDedicated/capacities/${capacityName}/suspend?api-version=2016-01-29`;

    // Make a POST request to suspend the capacity with the Authorization header
    const response = await axios.post(
      statusUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.status);
    return res.status(200).json({
      message: "Suspended successfully",
    });
  } catch (error) {
    console.error("Error suspending capacity:", error.message);
    return next(createError.createError(500, error.message));
  }
};

//START CAPACITY
exports.resume1Capacity = async (req, res, next) => {
  try {
    const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.TENANT_ID,
      {
        tokenAudience: "https://management.azure.com/",
      }
    );

    const token = creds?.tokenCache?._entries[0]?.accessToken;

    const url = `https://management.azure.com/subscriptions/${process.env.SUBSCRIPTION_ID}/resourceGroups/${process.env.RESOURCEGROUPNAME}/providers/Microsoft.Fabric/capacities/${process.env.DEDICATEDCAPACITYNAME}/resume?api-version=${process.env.APPVERSION}`;

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.status);

    return res.status(200).json({
      message: "Started successfully",
    });
  } catch (error) {
    console.error("Error suspending capacity:", error.message);
    return next(createError.createError(500, error.message));
  }
};

app.get("/workspaces", async (req, res) => {
  const token = await getToken();
  const workspaces = await getWorkspaces(token);
  res.json(workspaces);
});

app.get("/workspaces/:workspaceId/datasets", async (req, res) => {
  const { workspaceId } = req.params;
  const token = await getToken();
  const datasets = await getDatasets(token, workspaceId);
  res.json(datasets);
});

/////GET REPORT TEAM

exports.getReportPages = async (req, res, next) => {
  try {
    const groupId = req.query.groupId;

    const reportId = req.query.reportId;

    if (!groupId || !reportId) {
      return next(createError.createError(400, "pass all required parameters"));
    }

    // const groupId = req.params.groupId;

    // return res.json(groupId)

    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", process.env.SCOPE);

    const response1 = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    const token = response1?.data?.access_token;
    //    const token= req.query.token;
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/pages`;
    //    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/dashboards`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status(200).json(response.data.value);
  } catch (error) {
    console.log(error);
    return next(createError.createError(500, "Internal server error"));
  }
};
app.get("/workspaces/:workspaceId/reports", async (req, res) => {
  const { workspaceId } = req.params;
  const token = await getToken();
  const reports = await getReports(token, workspaceId);
  res.json(reports);
});

app.get("/workspaces/:workspaceId/dashboards", async (req, res) => {
  const { workspaceId } = req.params;
  const token = await getToken();
  const dashboards = await getDashboards(token, workspaceId);
  res.json(dashboards);
});

///TEST
const getToken = async (res) => {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("scope", "https://analysis.windows.net/powerbi/api/.default");

  try {
    const response = await axios.post(tokenUrl, params);
    return response?.data?.access_token;
  } catch (error) {
    // return res.status().json(error)
    console.error("Error getting token:", error);
  }
};

const getReports = async (token, groupId) => {
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.value;
  } catch (error) {
    console.error("Error getting reports:", error);
  }
};

const getDashboards = async (token, groupId) => {
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/dashboards`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.value;
  } catch (error) {
    console.error("Error getting dashboards:", error);
  }
};

const getDatasets = async (token, groupId) => {
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.value;
  } catch (error) {
    console.error("Error getting datasets:", error);
  }
};

//GENERATE TOKEN WITH PERMISSION
exports.generateTokenWithRequiredPermission = async (req, res, next) => {
  try {
    const msalConfig = {
      auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET,
      },
    };

    const cca = new msal.ConfidentialClientApplication(msalConfig);

    const tokenRequest = {
      scopes: ["https://analysis.windows.net/powerbi/api/.default"],
    };

    const response = await cca.acquireTokenByClientCredential(tokenRequest);
    console.log("Access token:", response.accessToken);
    return res.status(200).json(response.accessToken);
  } catch (error) {
    console.error(
      "Error getting token:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({
      message: error.message,
      details: error.response ? error.response.data : null,
    });
  }
};

//DOWNLOAD REPORTS
exports.downloadReports = async (req, res, next) => {
  try {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const reportId = "fe8f66c9-5317-4818-b559-9967f69e3056"; // Replace with your actual report ID
    const groupId = "3f46887a-6ddc-4106-9896-1dc3d379459e"; // Replace with your actual group ID

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("scope", "https://analysis.windows.net/powerbi/api/.default");

    // Get access token
    const tokenResponse = await axios.post(tokenUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const token = tokenResponse.data.access_token;

    // Download the report
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/ExportTo`;

    const exportConfig = {
      format: "PDF", // Specify the desired format here (PDF, PNG, PPTX, etc.)
      // Add other configurations if needed
    };

    const response = await axios.post(url, exportConfig, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer", // Ensure the response is treated as binary data
    });

    // Save the report to a file
    fs.writeFileSync("report.pdf", response.data);
    console.log("Report downloaded successfully.");

    // const params = new URLSearchParams();
    // params.append('grant_type', 'client_credentials');
    // params.append('client_id', process.env.CLIENT_ID);
    // params.append('client_secret', process.env.CLIENT_SECRET);
    // params.append('scope', 'https://analysis.windows.net/powerbi/api/.default');

    // // Get access token
    // const tokenResponse = await axios.post(tokenUrl, params.toString(), {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    //   },
    // });

    // const token = tokenResponse.data.access_token;
    // // Initiate the report export
    // const exportUrl = `https://api.powerbi.com/v1.0/myorg/reports/${reportId}/ExportTo`;

    // const exportConfig = {
    //   format: 'PDF',
    //   // Add other configurations if needed
    // };

    // const exportResponse = await axios.get(exportUrl, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    // });

    // if (exportResponse.status !== 202) {
    //   throw new Error('Failed to initiate export');
    // }

    // const exportId = exportResponse.data.id;

    // // Poll the export status
    // const statusUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/exports/${exportId}`;
    // let statusResponse;
    // while (true) {
    //   statusResponse = await axios.get(statusUrl, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   if (statusResponse.data.status === 'Succeeded') {
    //     break;
    //   } else if (statusResponse.data.status === 'Failed') {
    //     throw new Error('Export failed');
    //   } else {
    //     console.log(`Export status: ${statusResponse.data.status}. Checking again in 5 seconds...`);
    //     await new Promise(resolve => setTimeout(resolve, 5000));
    //   }
    // }

    // // Download the report
    // const downloadUrl = statusResponse.data.resourceLocation;
    // const reportResponse = await axios.get(downloadUrl, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   responseType: 'arraybuffer', // Ensure the response is treated as binary data
    // });

    // // Save the report to a file
    // fs.writeFileSync('report.pdf', reportResponse.data); // Save as PDF
    // console.log('Report downloaded successfully.');

    res.send("Report downloaded successfully.");
  } catch (error) {
    console.error("Error downloading report:", error);
    return next(createError.createError(500, "Internal server error"));
  }
};
