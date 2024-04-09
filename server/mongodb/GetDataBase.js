import { MongoClient } from 'mongodb';
import {config} from 'dotenv'

config()
// MongoDB connection URL
const pass=process.env.PASS;
const url = `mongodb+srv://lightwing2208:${pass}@cluster0.ztpqsqb.mongodb.net/`;


class DatabaseService {
    constructor() {
      this.client = new MongoClient(url);
      this.db = this.client.db(process.env.DB_NAME);
    }
    run() {
      try {
        this.client.connect();
      } catch (error) {
        console.log("error", error);
      }
    }
    get users() {
      return this.db.collection("users");
    }
    get book() {
      return this.db.collection("books");
    }
    
    get comment(){
        return this.db.collection("comment");
    }
    get importedBook(){
        return this.db.collection("importedBook");
    }
    get admin(){
      return this.db.collection("admin")
    }
    get receipt(){
      return this.db.collection("receipt")
    }
    get hiredBook(){
      return this.db.collection("hiredBook")
    }

}
const databaseProject = new DatabaseService()
export default databaseProject;