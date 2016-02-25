export class Todo {
    constructor(
        public id:string,
        public content:string,
        public link:string,
        public status?:string,
        public creationDate?:Date,
        public modificationDate?:Date) { }
}