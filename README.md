# BlobChat

BlobChat is a minimalist and elegant chat app. 

1. Make a post and talk about anything you want.
2. Blob will find similar posts made by other users.  
Select another user's post and start chatting.
3. Chat for as long as you wish until there's no new response from either party for longer than 3 days (in demo it's set to 60 seconds).  

# How to Blob
![Make a post](https://raw.githubusercontent.com/redis-developer/BlobChat/main/public/1_index_screenshot.png)
![Find a match](https://raw.githubusercontent.com/redis-developer/BlobChat/main/public/2_posts_screenshot.png)
![Enjoy a chat](https://raw.githubusercontent.com/redis-developer/BlobChat/main/public/3_chat_screenshot.png)

# Technology Used

The local server/client setup to support a web application.

- NodeJS
- SocketIO
- Express

# Redis Modules

- Redis - to store posts and chat messages
- RediSearch - to index and explore potential matches.


# Build Locally

## Step 1. Clone the repo to your local directory and start the application

```
git clone https://github.com/redis-developer/BlobChat
```


## Step 2. Build Docker images locally.

```
docker-compose build
```

## Step 3. Start the Redis server.

```
docker-compose up -d
```

## Step 4. Install the npm dependencies.

```
npm install
```

## Step 5. Start the chat client (with nodemon).

```
npm run start
```
Now you can go to http://localhost:5000/ to start.

> For the simplicity of the demonstration, some logic have been altered:
> * Pre-populated sample posts are in [/public/sample_posts.json].
> * Chat timeouts in 60s instead of 3 days. History is not automatically cleared in the UI, but refreshing the page will do.


# Redis Command Explained

### Posts (Redis Hash, RediSearch)
**FT.CREATE**  
Create a RediSearch index on all posts (key prefix `post`) and make the content of the posts full-text searchable.  
e.g. `Redis: FT.CREATE posts_idx ON HASH PREFIX 1 post SCHEMA content TEXT`

**HSET**  
When user creates a new post, store the content with the username.  
e.g. `Redis: HSET post_CookieMonster username CookieMonster content "A brown fox jumps over the fence."`

**FT.SEARCH**  
Search among existing posts in RedisSearch for similar posts.  
e.g. `Redis: FT.SEARCH posts_idx "what | a | lovely | day"`

### Chat (Redis List)
**RPUSH**  
Add a new message to the bottom of the chat history between two users.  
e.g. `Redis: RPUSH messages fromUser:toUser:Hi`

**EXPIRE**  
Set the conversation history to expire.  
e.g. `Redis: EXPIRE messages 60`

**LRANGE**  
Retrieves all chat messages from Redis.  
e.g. `Redis: LRANGE messages 0 -1`

# Tech Debt
### Future improvements
* Use RedisAI to train on the user data (content of posts, and what posts got chosen by certain users),
and make better recommendations.
* Use Redis to store user connections so that a chat room can only be joined by people who are a match from the previous step.

### Smaller UI issues
* Username does not allow whitespaces but there's no actual validation.
* Auto scrolling is not implemented, users might not see that they have got new messages.
* Pushing the enter button on a keyboard does not send the message, only the UI button does.

# Reference
Used [CSS style sheet](https://bbbootstrap.com/snippets/simple-chat-application-57631463) as a css starter.  
Blob icon is created via [Blobs.app](https://blobs.app/?e=6&gw=6&se=3&g=eecda3|ef629f&o=0).
[Color palette](https://coolors.co/f6bd60-f7ede2-f5cac3-84a59d-f28482).
