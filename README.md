# Chatbot Pop-Up

A pop-up chatbot that may be imbedded on a website.

## Deployment

If the application doesn't exist, push the initial application to the cloud.  The app will not have services attached to it and it will fail... but it will create the application.  From the root of this repository:

`ibmcloud push`

Once the application is created, then create the services:

### Services
1. Create the Conversation service on IBM Cloud
2. Connect it to the application
3. Create credentials/service keys
5. Create a `.env` file that follows the [`.env.example`](.env.example) format

Then restart the application!