# Microsoft Sentinel Azure Setup

## _Create App Registration & Add Related User Options_
**1**. Navigate to `App Registrations`
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

**8**. Copy your new client secret `Value` (_Not ID_) to to the relevant Polarity User Option
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

**11**. Copy the `Subscription ID` & `Resource group name` to the relevant Polarity User Option
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
