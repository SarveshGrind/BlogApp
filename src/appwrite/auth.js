import { Account, Client, ID } from 'appwrite'
import {conf} from '../conf/conf'

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)

            if (userAccount) {
                // call account
                return this.login({email, password})
            }else{
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite signup :: createAccount :: error", error);
            
        }
    }

    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            console.log("Appwrite signIn :: login :: error", error);
            
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            // console.log("Appwrite getCurrentUser :: getCurrentUser :: error", error);
            return null
            
        }

        return null;
    }

    async logout(){
        try {
            await this.account.deleteSessions(); 
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
            
        }
    }
}

 const authService = new AuthService()

export default authService

// We reject the below code and go with the above code because we want smooth handeling of login which is done through abistraction so our code remains great

// import { Client, Account} from 'appwrite';

// export const client = new Client();

// client
//     .setEndpoint('https://<REGION>.cloud.appwrite.io/v1')
//     .setProject('<PROJECT_ID>'); // Replace with your project ID

// export const account = new Account(client);
// export { ID } from 'appwrite';
