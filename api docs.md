-------------------------------------user---------------------------------------
## create new user
## POST
# /api/user/create
{"userName":"manjunath",
"email":"manjunath@va.com",
"password":"manjunath",
"mobileNo":9611140632,
"role":1
}

## get user by Id GET
# /api/user/id/:id 

# authentication GET
## /api/user/email/:email/password/:password

# get all users 
/api/user/getAll

# get users by role
/api/user/role/:role

# update user
/api/user/update

# delete a user By Id
/api/user/delete/:id

# logout to capture logout time
/api/user/updateLogout

---------------------------------------email-------------------------------------
# send an email (compose)
## POST multipart formdata
## attachments is key for file input (files which are uploaded is limited to 5)
/api/email/send
{
  recipients:string
  subject:string
  body:string
  attachments:file
  cc:string
}
attachments:file
attachments limit is 5

# to sync emails from imap to database
## GET
/api/email/sync

# to get All the emails into the inbox
## GET
/api/email/inbox

# to get a single thread from inbox
## GET
/api/email/inbox/:id

# to mark the thread as seen from inbox
## GET
/api/email/inbox/seen/:id

# to get attachments of inbox thread
## GET
/api/email/inbox/filename/:filename

file (binary data)

# to delete a thread from inbox
## DELETE
/api/email/inbox/:id

# to delete selected threads (batch delete), pass _id inside selected array
## PATCH
/api/email/inbox/deleteSelected
{
  selected:[5ecf61d37fd02a1f344bc359','5ecf61da7fd02a1f344bc35a']
}

# to get all emails from sent
## GET
/api/email/sent

# to delete a thread from sent
## DELETE
/api/email/sent/:id

# to delete selected threads (batch delete), pass _id inside selected array
## PATCH
/api/email/sent/deleteSelected
{
  selected:[5ecf61d37fd02a1f344bc359','5ecf61da7fd02a1f344bc35a']
}

# to get single Thread from sent
## GET
/api/email/sent/:id

# to get attachments of sent thread
## GET
/api/email/sent/filename/:filename

file (binary data)
----------------------------------------

---------------------------------- Room--------------------------------------------------------
## create new room
## POST
# /api/room/create
{"roomName":"group",
"roomType":"PRIVATE_CHAT",
"messagesCount":2,
"namespace":"CUSTOMER-SERVICE-ASSOCIATIVE",
"issue":"other issue",
"users":[{"_id":"",userName:""}],
"owner":"015f7d573eb8059142f3"
}

## get room by Id 
## GET
# /api/room/id/:id 

# get all rooms 
## GET
/api/room/getAll

# get all rooms by namespace
## GET
# /api/room/getAll/namespace/:namespace

# to update room users 
## PATCH
# /api/room/updateRoomUsers

{
"id":"",
users:[{"_id":"","userName":""}]
}

# to delete a room 
## DELETE
/api/room/:id



----------------------------------------Chat History -------------------------------------
## create new chat
## POST
# /api/chatHistory/create
{"roomId":"738393f720209920",
"createdAt":"",
"chatType":"PRIVATE_CHAT",
"members":[{"_id":"",userName:""}],
"fromId":"015f7d573eb8059142f3",
"fromName":"ddd",
"message":"hello how are you?"
}

# get all chats 
## GET
/api/chatHistory/getAll

# get all chats By roomId
## GET
/api/chatHistory/roomId/:roomId

# to delete a chat 
## DELETE
/api/chatHistory/:id

---------------------------------- Customer Queue--------------------------------------------------------
## create new queue
## POST
# /api/customerQueue/create
{
  "payload": {"userName":""}
}

## get single queue which is still pending 
## GET
# /api/customerQueue/pending

# get all queues 
## GET
# /api/customerQueue/getAll

# get all queues which is still pending
## GET
# /api/customerQueue/getAll/pending

# to acknowledge a queue
## PUT
# /api/customerQueue/acknowledge
{
  "id":"015f7d573eb8059142f3",
  "userId":"015f7d573eb8059142f3"
}

# to mark a queue as deleted
## PATCH
# /api/customerQueue/markDeleted
{
  "id":"015f7d573eb8059142f3"
}

# to delete a acknowledged queue 
## DELETE
/api/customerQueue/:id

# to delete all acknowledged queues
## DELETE
/api/customerQueue/deleteAll

# to delete selected queues (batch delete), pass _id inside selected array
## PATCH
/api/customerQueue/deleteSelected
{
  selected:[5ecf61d37fd02a1f344bc359','5ecf61da7fd02a1f344bc35a']
}