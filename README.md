# Goal Tracker

This will be the API for the front-end React app part of our practicum project.

These instructions are for the **front-end team** so they can setup their local development environment to run
both the back-end server and their front-end app.

> The back-end server will be running on port 8000. The front-end app will be running on port 5173. You will need to run
> both the back-end server and the front-end app at the same time to test your app.

## Setting up local development environment

1. Create a folder to contain both the front-end and back-end repos
2. Clone this [repository](https://github.com/Code-the-Dream-School/ii-practicum-team-2-back.git) to that folder
3. Create `.env` file in the root of backend folder (you can copy from `.env.example` and set it with your vars)
4. Run `npm install` to install dependencies inside backend directory
5. Run `npm run dev` to start the development server
6. Open http://localhost:8000/api/v1/ with your browser to test
7. Your back-end server is now running. You can now run the front-end app
8. Swagger API Docs are available at http://localhost:8000/docs (json format at http://localhost:8000/docs.json)

> N.B. Start every coding session with pulling `main` branch of this repository.

### Running the back-end server in Visual Studio Code

Note: In the below example, the group's front-end repository was named `bb-practicum-team1-front` and the back-end
repository was named `bb-practicum-team-1-back`. Your repository will have a different name, but the rest should look
the same.
![vsc running](docs/images/back-end-running-vsc.png)

### Testing the back-end server API in the browser

![browser server](docs/images/back-end-running-browser.png)

### To build TS into JS (production ready)

`npm run build` and then you can run `npm run start`

### Running ESLint

`npm run lint` - to check everything.
`npm run lint:fix` - to fix everything.

### Running Prettier

`npm run prettier:write` - to format everything.

## DB Schema

![img.png](docs/images/db-schema.png)

### Diagram as a code:

Can be pasted on https://planttext.com/ (click “Refresh” to generate diagram)

<details>
  <summary>Click to expend</summary>

```
@startuml

' === USERS ===
entity user {
  *id : UUID <<PK>>
  name : String
  email : String <<unique>>
  password : String
  created_at : DateTime
  updated_at : DateTime
}

entity user_auth_providers {
  *id : UUID <<PK>>
  user_id : UUID <<FK>>
  provider : String
  provider_user_id : String
  created_at : DateTime
}

entity password_reset_tokens {
  *id : UUID <<PK>>
  user_id : UUID <<FK>>
  token : String
  expires_at : DateTime
  used : Boolean
  created_at : DateTime
}

' === GOALS & PROGRESS ===
entity goal {
  *id : UUID <<PK>>
  name : String
  description : Text
  user_id : UUID <<FK>>
  goal_type_id : UUID <<FK>>
  created_at : DateTime
  updated_at : DateTime
}

entity goal_type {
  *id : UUID <<PK>>
  name : String
  description : String
}

entity goal_type_field {
  *id : UUID <<PK>>
  goal_type_id : UUID <<FK>>
  field_name : String
  field_type : String <<Enum>>
  required : Boolean
  options : JSON
  trackable : Boolean
}

entity goal_field_value {
  *id : UUID <<PK>>
  goal_type_field_id : UUID <<FK>>
  goal_id : UUID <<FK>>
  user_id : UUID <<FK>>
  value : String
}

entity goal_progress {
  *id : UUID <<PK>>
  goal_id : UUID <<FK>>
  goal_type_field_id : UUID <<FK>>
  user_id : UUID <<FK>>
  progress_value : Int
  created_at : DateTime
}

' === DAILY QUESTS ===
entity daily_quest {
  *id : UUID <<PK>>
  user_id : UUID <<FK>>
  goal_id : UUID <<FK>> <<nullable>>
  suggestion_id : UUID <<FK>> <<nullable>>
  title : String
  icon : String
  is_daily : Boolean
  frequency : String[]
  created_at : DateTime
  updated_at : DateTime
}

entity daily_quest_completion {
  *id : UUID <<PK>>
  daily_quest_id : UUID <<FK>>
  user_id : UUID <<FK>>
  date : Date
  completed_at : DateTime
}

' === GOAL BOARD (Image Uploads) ===
entity goal_board {
  *id : UUID <<PK>>
  user_id : UUID <<FK>>
  file_path : String
  thumbnail_path : String
  created_at : DateTime
}

' === SUGGESTIONS ===
entity suggestion {
  *id : UUID <<PK>>
  title : String
  icon : String
  created_at : DateTime
  updated_at : DateTime
}

' === RELATIONSHIPS ===
user ||--o{ user_auth_providers : authenticates_with
user ||--o{ password_reset_tokens : can_reset
user ||--o{ goal : owns
goal_type ||--o{ goal : typed_as
goal_type ||--o{ goal_type_field : defines
goal ||--o{ goal_field_value : has
goal_type_field ||--o{ goal_field_value : defined_by
goal ||--o{ goal_progress : tracks
goal_type_field ||--o{ goal_progress : for_field
user ||--o{ goal_progress : logs

user ||--o{ daily_quest : creates
goal ||--o{ daily_quest : supports
suggestion ||--o{ daily_quest : based_on
daily_quest ||--o{ daily_quest_completion : logs
user ||--o{ daily_quest_completion : toggles

user ||--o{ goal_board : adds_pictures

@enduml
```

</details>

## API endpoints

<details>
  <summary>Click to expend</summary>

### 🧑 Users & Auth

| Method  | Endpoint                               | Description                       |
|---------|----------------------------------------|-----------------------------------|
| `POST`  | `/api/v1/users/register`               | Register a new user               |
| `POST`  | `/api/v1/users/login`                  | Log in with email and password    |
| `POST`  | `/api/v1/users/google-login`           | Log in or register via Google     |
| `POST`  | `/api/v1/users/password-reset/request` | Request password reset link       |
| `POST`  | `/api/v1/users/password-reset/confirm` | Confirm password reset with token |
| `GET`   | `/api/v1/users/profile`                | Get current user profile          |
| `PATCH` | `/api/v1/users/profile`                | Update current user's profile     |

### 🎯 Goals (Instances)

| Method   | Endpoint            | Description                        |
|----------|---------------------|------------------------------------|
| `GET`    | `/api/v1/goals`     | List all goals for current user    |
| `GET`    | `/api/v1/goals/:id` | Get a specific goal and details    |
| `POST`   | `/api/v1/goals`     | Create a new goal from a goal type |
| `PATCH`  | `/api/v1/goals/:id` | Update goal name/description       |
| `DELETE` | `/api/v1/goals/:id` | Delete (archive) a goal            |

### 🧾 Goal Field Values

| Method  | Endpoint                         | Description                     |
|---------|----------------------------------|---------------------------------|
| `PATCH` | `/api/v1/goals/:id/field-values` | Update static values for a goal |

### 🧾 Goal Board Images

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| `GET`  | `/api/v1/goal-board` | Get goal board images      |
| `POST` | `/api/v1/goal-board` | Upload image to goal board |

### 🧱 Goal Types (Templates)

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| `GET`  | `/api/v1/goal-types`            | List all goal types            |
| `GET`  | `/api/v1/goal-types/:id`        | Get type and its fields        |
| `POST` | `/api/v1/goal-types`            | Create a new goal type (admin) |
| `POST` | `/api/v1/goal-types/:id/fields` | Add fields to a goal type      |

### 📈 Goal Progress

| Method | Endpoint                         | Description                     |
|--------|----------------------------------|---------------------------------|
| `GET`  | `/api/v1/goals/:goalId/progress` | Get progress entries for a goal |
| `POST` | `/api/v1/goals/:goalId/progress` | Add new progress for a goal     |

### 📅 Daily Quests

| Method   | Endpoint                          | Description                            |
|----------|-----------------------------------|----------------------------------------|
| `GET`    | `/api/v1/daily-quests`            | List all daily quests for user         |
| `POST`   | `/api/v1/daily-quests`            | Create a daily quest                   |
| `GET`    | `/api/v1/daily-quests/for-date`   | Get quests for a given date            |
| `PATCH`  | `/api/v1/daily-quests/:id`        | Update a daily quest                   |
| `DELETE` | `/api/v1/daily-quests/:id`        | Delete a daily quest                   |
| `POST`   | `/api/v1/daily-quests/:id/toggle` | Toggle daily quest completion for date |

### 📅 Daily Quests Suggestions

| Method   | Endpoint                               | Description                              |
|----------|----------------------------------------|------------------------------------------|
| `GET`    | `/api/v1/daily-quests/suggestions`     | List suggestions (excluding active ones) |
| `GET`    | `/api/v1/daily-quests/suggestions/:id` | Read single suggestion by ID             |
| `POST`   | `/api/v1/daily-quests/suggestions`     | Create new suggestion                    |
| `PATCH`  | `/api/v1/daily-quests/suggestions/:id` | Update a suggestion                      |
| `DELETE` | `/api/v1/daily-quests/suggestions/:id` | Delete a suggestion                      |

</details>
