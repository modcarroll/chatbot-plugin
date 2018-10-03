# Watson Assistant Pop-Up Sample Application
This Node.js app demonstrates the Watson Assistant service in a simple chat pop-up interface.

## Prerequisites

1. Sign up for an [IBM Cloud account](https://console.bluemix.net/registration/).
1. Download the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview).
1. Create an instance of the Watson Assistant service and get your credentials:
    - Go to the [Watson Assistant](https://console.bluemix.net/catalog/services/conversation) page in the IBM Cloud Catalog.
    - Log in to your IBM Cloud account.
    - Click **Create**.
    - Click **Show** to view the service credentials.
    - Copy the `username` and `password`.

## Configuring the application

1. In your IBM Cloud console, open the Watson Assistant service instance.

2. Click the menu icon in the upper-right corner of the workspace tile, and then select **View details**.

3. Click the copy icon to copy the workspace ID to the clipboard.

4. In the application folder, copy the *.env.example* file and create a file called *.env*

    ```
    cp .env.example .env
    ```

5. Open the *.env* file and add the service credentials that you obtained in the previous step.

## Running locally

1. Install the dependencies

    ```
    npm install
    ```

2. Run the application

    ```
    npm start
    ```

3. View the application in a browser at `localhost:3000`

## Deploying to IBM Cloud as a Cloud Foundry Application

1. Login to IBM Cloud with the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview)

    ```
    ibmcloud login
    ```

2. Target a Cloud Foundry organization and space.

    ```
    ibmcloud target --cf
    ```

3. Edit the *manifest.yml* file. Change the **name** field to something unique.  
  For example:
    ```
    - name: my-app-name
    ```

4. Deploy the application

    ```
    ibmcloud app push
    ```

5. View the application online at the app URL.  
For example: https://my-app-name.mybluemix.net