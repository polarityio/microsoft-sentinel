# Polarity Microsoft Sentinel Integration

![image](https://img.shields.io/badge/status-beta-green.svg)

Microsoft Sentinel puts the cloud and large-scale intelligence from decades of Microsoft security experience to work. 

The Polarity Microsoft Sentinel Integration allows users to search for WHOIS, Geolocation 
Data, Incidents, Threat Intelligence Indicators, and Query Logs via Kusto Queries for Domains, IP Addresses, and Hashes.


<div style="display:flex; justify-content:center; align-items: flex-start;">
  <img width="300" alt="Integration Example Search" src="./assets/integration-example.png">
</div>

To learn more about Microsoft Sentinel, visit the [official website](__TODO__).


## Microsoft Sentinel Integration Options
### Azure AD Registered App Client/Application ID
Your Azure AD Registered App's Client ID associated with your Microsoft Sentinel Instance.

### Azure AD Registered App Tenant/Directory ID
Your Azure AD Registered App's Tenant ID associated with your Microsoft Sentinel Instance.

### Azure AD Registered App Client Secret
Your Azure AD Registered App's Client Secret associated with your Microsoft Sentinel Instance.

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

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).


## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see:

https://polarity.io/
