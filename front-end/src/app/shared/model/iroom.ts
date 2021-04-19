export interface Iroom {
    _id ?: string;
    users : any[];
    issue:string;
    namespace:string;
    roomName : string;
    roomType : string;
    createdAt? : string;
    messagesCount? : number;
    owner? : any;
    accepted? :boolean;
}
