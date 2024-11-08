# API MARKSENGER Using MERN STACK #
## Model ##
### comment ###
- user_id type objectId
- post_id type objectId
- body type string

### group ###
- name type string
- picture type string
- create_id type objectId

### member ###
- user_id type objectId
- group_id type objectId

### message ###
- sender_id type objectId
- group_id type objectId
- body type objectId

### post ###
- user type objectId
- body type string
- picture type string
- status type number

### user ###
- firstname type string
- lastname type string
- email type string
- password type string
- picture type string
- role type string

