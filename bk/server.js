
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const {
    ConfidentialClientApplication
} = require("@azure/msal-node");

const app = express();

app.use(cors());


const config = {
    auth: {
        clientId: "f1466eda-9b68-4c13-8a26-2154984f2e57",
        authority:
            "https://login.microsoftonline.com/b69b7bb5-574e-41ed-a998-733157e8303a",
        clientSecret: "KRR8Q~WNP_mOWXZ3K8LFynq54ZO6bBOL.CEW3diX",
    }
};

const cca =
    new ConfidentialClientApplication(config);

async function getToken() {

    const response =
        await cca.acquireTokenByClientCredential({
            scopes: [
                "https://graph.microsoft.com/.default"
            ]
        });

    return response.accessToken;
}

app.get("/list", async (req, res) => {

    try {

        const token = await getToken();
        
        const SP_HOSTNAME="mngenvmcap081723.sharepoint.com";
        const SP_SITE_PATH="/sites/TestDB";
        const SP_LIST_NAME="Test_Templates";

        // ===== SITE =====

        const siteResponse = await axios.get(
            `https://graph.microsoft.com/v1.0/sites/${SP_HOSTNAME}:${SP_SITE_PATH}:`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const siteId = siteResponse.data.id;

        // ===== ITEMS =====

        const itemsResponse = await axios.get(
            `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${SP_LIST_NAME}/items?expand=fields($select=Title,Content,HDName)`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        
        function decodeHtml(html) {

            return html
                ?.replace(/&lt;/g, "<")
                ?.replace(/&gt;/g, ">")
                ?.replace(/&quot;/g, '"')
                ?.replace(/&#39;/g, "'")
                ?.replace(/&amp;/g, "&");
        }
        
        //console.log(JSON.stringify(itemsResponse.data.value[0].fields, null, 2));

        const cleanData = itemsResponse.data.value.map(item => ({
            //id: item.id,
            title: item.fields.Title,
            content: decodeHtml(item.fields.Content)
                ?.replace(/class="[^"]*"/g, '')
                ?.replace(/style="[^"]*"/g, '')
                ?.replace(/<div[^>]*>/g, '<div>')
                ?.trim(),
            displayName: decodeHtml(item.fields.HDName)
                ?.replace(/class="[^"]*"/g, '')
                ?.replace(/style="[^"]*"/g, '')
                ?.replace(/<div[^>]*>/g, '<div>')
                ?.trim() 
        }));
        console.log(cleanData);
        res.json(cleanData);


    } catch (err) {

        console.error(
            err.response?.data || err.message
        );

        res.status(500).json({
            error: "Error reading SharePoint"
        });
    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
