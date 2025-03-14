# NC News Seeding

- NOTE - This information would not normally be made publically availeble
  \*\* For the purposes of testing this the following is made available



# NC News API

A backend project providing a series of REST endpoints that serves data for a news platform.

**URL:** https://nc-news-hn5t.onrender.com/

## Overview
- Retrieve topics, articles, users, and comments.
- Post new comments on articles.
- Update article votes.
- Delete comments.

## Dependancies
- **Node.js** ^20.10.0
- **Express.js** ^4.21.2
- **PostgreSQL** ^8.13.3
- **Jest** ^27.5.1
- **Supertest** ^7.0.0
- **jest-sorted** ^1.0.15"


## Setup Instructions
#### clone
```
git clone <your-repo-url>
cd be-nc-news
```

#### dependancies
```
npm install
```

#### db
```
npm run setup-dbs
```

#### env files
.env.development
  PGDATABASE=nc_news

.env.test
  PGDATABASE=nc_news_test

#### seed
```
npm run seed-dev
```

#### test
```
npm test <filename>
```


## API Endpoints
### GET `/api`
all endpoints

### GET `/api/topics`
all topics.

### GET `/api/articles/:article_id`
article by its ID

### GET `/api/articles`
all articles

### GET `/api/articles/:article_id/comments`
comments for a specific article

### POST `/api/articles/:article_id/comments`
new comment to an article

### PATCH `/api/articles/:article_id`
update the votes for an article

### DELETE `/api/comments/:comment_id`
delete a comment by ID

### GET `/api/users`
retrieves all users
