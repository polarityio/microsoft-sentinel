# Polarity Microsoft Sentinel Integration

![image](https://img.shields.io/badge/status-beta-green.svg)

Microsoft Sentinel puts the cloud and large-scale intelligence from decades of Microsoft security experience to work.

The Polarity Microsoft Sentinel Integration allows users to search for WHOIS, Geolocation
Data, Incidents, Threat Intelligence Indicators, and Query Logs via Kusto Queries for Domains, IP Addresses, and Hashes.

> **_NOTE:_** You can find instructions on how to setup your _Azure instance of Microsoft Sentinel_ in [MicrosoftSentinelAzureSetup.md](./MicrosoftSentinelAzureSetup.md)

<div style="display:flex; justify-content:center; align-items: flex-start;">
  <img width="300" alt="Integration Example Search" src="./assets/integration-example.png">
</div>

To learn more about Microsoft Sentinel, visit the [official website](https://azure.microsoft.com/en-us/products/microsoft-sentinel/).

## Microsoft Sentinel Integration Options

### Azure AD Registered App Client/Application ID

Your Azure AD Registered App's Client ID associated with your Microsoft Sentinel Instance.

### Azure AD Registered App Tenant/Directory ID

Your Azure AD Registered App's Tenant ID associated with your Microsoft Sentinel Instance.

### Azure AD Registered App Client Secret Value

Your Azure AD Registered App's Client Secret Value associated with your Microsoft Sentinel Instance.

### Sentinel Subscription ID',

The Subscription ID associated with your Microsoft Sentinel Instance.

### Sentinel Resource Group Name

The Resource Group Name associated with your Microsoft Sentinel Instance.

### Sentinel Workspace Name & ID

The {{WORKSPACE_NAME}}:{{WORKSPACE_ID}} for the workspace associated with your Microsoft Sentinel Instance.
(e.g. sentinel-workspace1: 8dbg2cdf-fd06-42zf-8557-4606c98adb2a)

### Kusto Query String

Kusto Query String to execute on the Sentinel Log Analytics Workspace.
The string `{{ENTITY}}` will be replace by the looked up Entity.
For example: ThreatIntelligenceIndicator | search "{{ENTITY}}" | take 10

### Kusto Query Summary Fields

Comma delimited list of field values to include as part of the summary.  
These fields must be returned by your Kusto Query to appear in the Summary Tags.
This option must be set to "User can view and edit" or "User can view only"

### Kusto Query Ignore Fields

Comma delimited list of Fields to ignore from the Kusto Query Results in the Overlay.
This option must be set to "User can view and edit" or "User can view only".

### Lookback Days

The number of days to look back when querying logs, and incidents.

### Ignore Geodata/WHOIS Only Results

If checked, entities will not return if only Geodata and/or WHOIS data is found, and no other query types have results.

### Enable Threat Intelligence Searches

If enabled, the integration will search threat intelligence indicator data.

## Microsoft Sentinel Azure Setup

**1**. Navigate to App Registrations

<div style="margin-bottom: 10px;">
  <img alt="Navigate to App Registrations on Azure" src="./assets/nav-to-app-reg.png">
</div>

**2**. Select `New registration`
    <div style="margin-bottom: 10px;">
      <img width="450px" alt="Select `New registration`" src="./assets/select-new-reg.png">
    </div>

**3**. Add a memorable name for the new registration then click `Register`
    <div style="margin-bottom: 10px;">
      <img width="450px" alt="Memorable Name & Click `Register`" src="./assets/mem-name-click-register.png">
    </div>

**4**. Navigate to your newly created app registration, then copy the `Application (client) ID` & `Directory (tenant) ID` to the relevant Polarity User Options
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="63%" alt="Copy Client & Tenant IDs" src="./assets/copy-client-and-tenant-ids.png">
      <img width="35%" alt="Paste Client & Tenant IDs to User Options" src="./assets/paste-client-and-tenant-ids.png">
    </div>

**5**. Click the `Add certificate or secret` link
    <div style="margin-bottom: 10px;">
      <img alt="Add certificate or secret" src="./assets/add-cert-or-secret-link.png">
    </div>

**6**. Click `New client secret` 
    <div style="margin-bottom: 10px;">
      <img width="450px" alt="New client secret" src="./assets/new-client-secret.png">
    </div>

**7**. Add your desired secret key description then click `Add`
    <div style="margin-bottom: 10px;">
      <img width="450px" alt="Secret Description & Add" src="./assets/secret-desc-and-add.png">
    </div>

**8**. Copy your new client secret `Value` (_Not ID_) to the relevant Polarity User Option
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="66%" alt="Copy Secret Value" src="./assets/copy-secret-value.png">
      <img width="32%" alt="Paste Secret Value to User Options" src="./assets/paste-secret-value.png">
    </div>

## _Get Subscription & Resource User Options_
**9**. Navigate to `Log Analytics workspaces`
    <div style="margin-bottom: 10px;">
      <img width="550px" alt="Navigate to Log Analytics workspaces on Azure" src="./assets/nav-to-log-analytics-workspaces.png">
    </div>

**10**. Select the `Resource Group` associated with your Sentinel Log Analytics workspace
    <div style="margin-bottom: 10px;">
      <img width="650px" alt="Navigate to Log Analytics workspaces on Azure" src="./assets/select-resource-group.png">
    </div>

**11**. Copy the `Subscription ID` & `Resource group` name to the relevant Polarity User Option
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="63%" alt="Copy Subscription ID & Resource Group Name" src="./assets/copy-sub-id-and-resource-group-name.png">
      <img width="35%" alt="Paste Subscription ID & Resource Group Name" src="./assets/paste-sub-id-and-resource-group-name.png">
    </div>

## _Setup IAM Role for App Registration_
**12**. Navigate to `Access control (IAM)`
    <div style="margin-bottom: 10px;">
      <img width="700px" alt="Navigate to Access control (IAM)" src="./assets/nav-to-iam.png">
    </div>

**13**. Click `Add` then click `Add role assignment`
    <div style="margin-bottom: 10px;">
      <img width="550px" alt="Add IAM Role Assignment" src="./assets/add-role-assignment.png">
    </div>

**14**. Search for `Log Analytics Reader` and make sure to Click the table row for it before clicking `Next`
    <div style="margin-bottom: 10px;">
      <img width="700px" alt="Click Log Analytics Reader and Next" src="./assets/select-log-reader-role.png">
    </div>

**15**. Click `Select members +` then Search for your _App Registrations Name_ and Click the App Registrations Name
    <div style="margin-bottom: 10px;">
      <img width="550px" alt="Select Member pt1" src="./assets/select-member-pt1.png">
    </div>

**16**. Click `Select` then Click `Review + assign` 2 times
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="49%" alt="Select Member pt2" src="./assets/select-member-pt2.png">
      <img width="49%" alt="Review and Assign Role" src="./assets/review-and-assign-role.png">
    </div>

**17**. Navigate back to the `Log Analytics workspaces` (Step 9) and Select your Sentinel Log Analytics Workspace, then Copy the `Workspace Name` & `Workspace ID` to the relevant Polarity User Options 
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
      <img width="70%" alt="Copy Workspace Name & Workspace ID" src="./assets/copy-workspace-name-and-workspace-id.png">
      <img width="28%" alt="Paste Workspace Name & Workspace ID" src="./assets/paste-workspace-name-and-workspace-id.png">
    </div>

## Apply Changes
**18**. Make sure to Click `Apply Changes` for your Polarity User Options

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).
## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making. For more information about the Polarity platform please see:

https://polarity.io/
