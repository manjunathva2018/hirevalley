export interface ChatBody{
    roomId:string;
    room:string;
    chatType?:string;
    members?:any[];
    fromName:string;
    fromId:string;
    createdAt:Date;
    message:string;
}