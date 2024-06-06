const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const createError=require("../utils/errorResponse.js")
const app = express();
app.use(bodyParser.json());
const { URLSearchParams } = require('url');
const msal = require('@azure/msal-node');



exports.getAccessToken = async (req, res, next) => {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('scope', process.env.SCOPE);

    try {
        const response = await axios.post(tokenUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error getting token:', error.response ? error.response.data : error.message);
        return res.status(500).json({
            message: error.message,
            details: error.response ? error.response.data : null
        });
    }
};


exports.getEmbedToken = async (req, res, next) => {

    const groupId = req.query.groupId;
    const reportId= req.query.reportId;
           const token= req.query.token;

    const url2= `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('scope', process.env.SCOPE);

    try {
        const response = await axios.post(url2, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error getting token:', error.response ? error.response.data : error.message);
        return res.status(500).json({
            message: error.message,
            details: error.response ? error.response.data : null
        });
    }
};

//GET WORKSPACES
exports.getWorkspaces= async(req,res,next)=>{
    try {
     

        const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', process.env.CLIENT_ID);
        params.append('client_secret', process.env.CLIENT_SECRET);
        params.append('scope', process.env.SCOPE);
    
       
            const response = await axios.post(tokenUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
            const token = response?.data?.access_token;
            // const token = req.query.token;
            // return res.status(200).json(token)
         
        const url = 'https://api.powerbi.com/v1.0/myorg/groups';
        const response1 = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
             
            }
        });
        return res.status(200).json(response1.data);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
        // return next(createError.createError(500,"Internal server error"))
     
        // return next(createError.createError(500,error.response))
        
    }
}
//GET DATASETS
exports.getDATASETS = async (req, res, next) => {


    try {
       const groupId = req.query.groupId;

       
       const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
       const params = new URLSearchParams();
       params.append('grant_type', 'client_credentials');
       params.append('client_id', process.env.CLIENT_ID);
       params.append('client_secret', process.env.CLIENT_SECRET);
       params.append('scope', process.env.SCOPE);
   
      
           const response1 = await axios.post(tokenUrl, params.toString(), {
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
               }
           });
           const token = response1?.data?.access_token;
    //    const token= req.query.token;

       const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return   res.status(200).json(response.data.value);

    } catch (error) {
        console.error('Error getting datasets:', error);
    }
};

//GET REPORTS
exports.getReports = async (req, res, next) => {


    try {
       const groupId = req.query.groupId;


       
       const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
       const params = new URLSearchParams();
       params.append('grant_type', 'client_credentials');
       params.append('client_id', process.env.CLIENT_ID);
       params.append('client_secret', process.env.CLIENT_SECRET);
       params.append('scope', process.env.SCOPE);
   
      
           const response1 = await axios.post(tokenUrl, params.toString(), {
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
               }
           });
           const token = response1?.data?.access_token;
    //    const token= req.query.token;

       const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return   res.status(200).json(response.data.value);

    } catch (error) {
        console.error('Error getting datasets:', error);
    }
};


//GET REPORTS
exports.getsampleReports = async (req, res, next) => {


    try {
       const groupId = req.query.groupId;
       const token= req.query.token;
       const reportId=req.query.reportId

       const url = `https://api.powerbi.com/v1.0/myorg/reports/${reportId}`;
    //    return res.json(url)
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return   res.status(200).json(response.data.value);

    } catch (error) {
        console.error('Error getting datasets:', error);
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
       params.append('grant_type', 'client_credentials');
       params.append('client_id', process.env.CLIENT_ID);
       params.append('client_secret', process.env.CLIENT_SECRET);
       params.append('scope', process.env.SCOPE);
   
      
           const response1 = await axios.post(tokenUrl, params.toString(), {
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
               }
           });
           const token = response1?.data?.access_token;
    //    const token= req.query.token;
       const reportId=req.query.reportId;

       const response = await axios.get(`https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    
     return res.json(response.data);

    } catch (error) {
        console.error('Error getting datasets:', error);
        return res.status(500).json(error)
    }
};



exports.fetchEmbedToken = async (req, res, next) => {
    try {
        const groupId = req.query.groupId;
        const reportId = req.query.reportId;
        const token = req.query.token;
        const body = JSON.stringify({
            accessLevel: "View",
            allowSaveAs: false
          });
        const url= `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`
        // const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}`;
        const response = await axios.post(url,  body,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }, 
            
        });

        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Error getting report details:', error);
        return res.status(500).json({ error: error });
    }
}


//GET DASHBOARDS
exports.getDashboards = async (req, res, next) => {
    try {
       const groupId = req.query.groupId;
       
       const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
       const params = new URLSearchParams();
       params.append('grant_type', 'client_credentials');
       params.append('client_id', process.env.CLIENT_ID);
       params.append('client_secret', process.env.CLIENT_SECRET);
       params.append('scope', process.env.SCOPE);
   
      
           const response1 = await axios.post(tokenUrl, params.toString(), {
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
               }
           });
           const token = response1?.data?.access_token;
    //    const token= req.query.token;

       const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/dashboards`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return   res.status(200).json(response.data.value);

    } catch (error) {
        console.error('Error getting datasets:', error);
    }
};




app.get('/workspaces', async (req, res) => {
    const token = await getToken();
    const workspaces = await getWorkspaces(token);
    res.json(workspaces);
});

app.get('/workspaces/:workspaceId/datasets', async (req, res) => {
    const { workspaceId } = req.params;
    const token = await getToken();
    const datasets = await getDatasets(token, workspaceId);
    res.json(datasets);
});

app.get('/workspaces/:workspaceId/reports', async (req, res) => {
    const { workspaceId } = req.params;
    const token = await getToken();
    const reports = await getReports(token, workspaceId);
    res.json(reports);
});

app.get('/workspaces/:workspaceId/dashboards', async (req, res) => {
    const { workspaceId } = req.params;
    const token = await getToken();
    const dashboards = await getDashboards(token, workspaceId);
    res.json(dashboards);
});





///TEST
const getToken = async (res) => {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('scope', 'https://analysis.windows.net/powerbi/api/.default');

    try {
        const response = await axios.post(tokenUrl, params);
        return response?.data?.access_token;
    } catch (error) {
        // return res.status().json(error)
        console.error('Error getting token:', error);
    }
};


const getReports = async (token, groupId) => {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.value;
    } catch (error) {
        console.error('Error getting reports:', error);
    }
};

const getDashboards = async (token, groupId) => {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/dashboards`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.value;
    } catch (error) {
        console.error('Error getting dashboards:', error);
    }
};


const getDatasets = async (token, groupId) => {
    const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.value;
    } catch (error) {
        console.error('Error getting datasets:', error);
    }
};


exports.generateTokenWithRequiredPermission = async (req, res, next) => {
   
    try {
      
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET
    }
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

const tokenRequest = {
    scopes: ["https://analysis.windows.net/powerbi/api/.default"]
};


        const response = await cca.acquireTokenByClientCredential(tokenRequest);
        console.log('Access token:', response.accessToken);
        return   res.status(200).json(response.accessToken);
  
}
    catch (error) {
        console.error('Error getting token:', error.response ? error.response.data : error.message);
        return res.status(500).json({
            message: error.message,
            details: error.response ? error.response.data : null
        });
    }
};
