# API Integration & Endpoint Specification

This document details all RESTful API endpoints called by the MarketMaven frontend client (`src/services/apiClient.ts`). The API contracts align with the FastAPI backend service.

---

## Base Configuration

- **Base URL**: Set via `VITE_API_BASE_URL` environment variable (e.g. `https://api.marketmaven.com`).
- **Authentication**: JWT Bearer token passed in the `Authorization` header (`Authorization: Bearer <token>`).
- **Content-Type**: `application/json`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new user account and returns an access token.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "Jane Doe"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "name": "Jane Doe"
    }
  }
  ```

### `POST /auth/login`
Authenticates user credentials and returns a session token.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `200 OK` (`access_token`, `user` object)

### `GET /auth/me`
Retrieves the profile of the currently authenticated user.
- **Auth Required**: Yes (`Bearer Token`)
- **Response**: `200 OK`
  ```json
  {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "admin"
  }
  ```

### `POST /auth/verify-email`
Verifies account ownership using an emailed token.
- **Query Parameter**: `token` (string)
- **Auth Required**: No
- **Response**: `200 OK` `{"message": "Email verified successfully"}`

### `POST /auth/forgot-password`
Initiates password reset flow by sending a token to the user's email.
- **Request Body**: `{"email": "user@example.com"}`
- **Response**: `200 OK` `{"message": "Password reset instructions sent"}`

### `POST /auth/reset-password`
Resets the password using a valid reset token.
- **Request Body**: `{"token": "reset_token_str", "new_password": "NewSecurePassword123!"}`
- **Response**: `200 OK` `{"message": "Password updated successfully"}`

---

## 2. Watchlist & Portfolio Endpoints

### `GET /watchlist`
Fetches all tickers in the user's custom watchlist.
- **Auth Required**: Yes
- **Response**: `200 OK` Array of `WatchlistApiItem`:
  ```json
  [
    {
      "issuer_id": "iss_001",
      "ticker": "MTNN",
      "name": "MTN Nigeria Plc",
      "exchange": "NGX",
      "price": 245.5,
      "change": 3.2,
      "changePercent": 1.32
    }
  ]
  ```

### `POST /watchlist`
Adds a ticker to the watchlist.
- **Auth Required**: Yes
- **Request Body**: `{"issuer_id": "iss_001"}`
- **Response**: `201 Created` (`WatchlistApiItem`)

### `DELETE /watchlist/{issuer_id}`
Removes an issuer from the user's watchlist.
- **Auth Required**: Yes
- **Response**: `200 OK` `{"message": "Issuer removed from watchlist"}`

---

## 3. Saved Articles Endpoints

### `GET /saved-articles`
Retrieves all bookmarked articles for the user.
- **Auth Required**: Yes
- **Response**: `200 OK` Array of `Article` objects with `saved_at` timestamp.

### `POST /saved-articles/{insight_id}`
Bookmarks an article.
- **Auth Required**: Yes
- **Response**: `200 OK` `{"message": "Article saved"}`

### `DELETE /saved-articles/{insight_id}`
Removes a saved article bookmark.
- **Auth Required**: Yes
- **Response**: `200 OK` `{"message": "Article bookmark removed"}`

---

## 4. Market Insights & News Feed Endpoints

### `GET /insights`
Queries market news and analytical insights with filtering and sorting options.
- **Query Parameters**:
  - `vertical` (string): e.g. `Equities`, `Fixed Income`, `Macro`
  - `sort` (string): `relevance` | `recent`
  - `limit` (integer): Max items to return
  - `category` (string): Category filter
  - `search` (string): Search query text
  - `exclude_ids` (csv string): Exclude specified article IDs
- **Response**: `200 OK` Array of `Article` objects.

### `GET /insights/top-sources`
Fetches top media and institutional content sources.
- **Query Parameter**: `vertical` (optional)
- **Response**: `200 OK` Array of `TopSource` items.

---

## 5. Editor's Picks & Research Reports Endpoints

### `GET /editors-picks`
Fetches curated editor highlight stories.
- **Query Parameter**: `limit` (integer)
- **Response**: `200 OK` Array of `EditorsPickItem` objects.

### `GET /reports`
Fetches institutional research reports.
- **Query Parameters**: `vertical` (string), `limit` (integer)
- **Response**: `200 OK` Array of `ReportItem` objects.

### `GET /reports/{slug}`
Retrieves a single research report by unique URL slug.
- **Response**: `200 OK` `ReportItem` object.

---

## 6. Admin Research Report Authoring Endpoints

### `GET /admin/reports`
Lists all research reports including drafts.
- **Auth Required**: Yes (Admin role)
- **Response**: `200 OK` Array of `ReportItem`.

### `POST /admin/reports`
Creates a new research report.
- **Auth Required**: Yes (Admin role)
- **Request Body**:
  ```json
  {
    "title": "Q3 Macroeconomic Outlook",
    "vertical": "Macroeconomics",
    "summary": "Executive summary of Q3 projections...",
    "body": "Full report body text...",
    "status": "published",
    "featured": true
  }
  ```
- **Response**: `201 Created` (`ReportItem`)

### `PATCH /admin/reports/{id}`
Updates an existing report.
- **Auth Required**: Yes (Admin role)
- **Response**: `200 OK` (`ReportItem`)

### `DELETE /admin/reports/{id}`
Deletes a research report.
- **Auth Required**: Yes (Admin role)
- **Response**: `200 OK` `{"message": "Report deleted"}`

---

## 7. Newsletter Endpoint

### `POST /newsletter-signup`
Subscribes an email address to market briefs and breaking news alerts.
- **Request Body**: `{"email": "subscriber@example.com"}`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "already_subscribed": false,
    "message": "Successfully subscribed to daily brief",
    "email": "subscriber@example.com"
  }
  ```

---

## 8. Market Data & Benchmark Endpoints

### `GET /benchmark`
Retrieves benchmark market rate summary (e.g. CBN, NAFEM, Interbank rates).
- **Response**: `200 OK` Benchmark rate object.

### `GET /peer-mappings`
Returns sector peer groupings for comparison metrics.
- **Response**: `200 OK` Key-value map of sector ticker arrays.

### `GET /issuers`
Retrieves master list of listed securities.
- **Response**: `200 OK` Array of `{ issuer_id, ticker, name, exchange, sector }`.

### `GET /issuers/{id}/prices`
Retrieves price history and quotes for a specific security.
- **Response**: `200 OK` `StockData` object.

### `GET /indices/{code}`
Retrieves historical values for a market index (e.g. `ASI`, `NSE30`).
- **Response**: `200 OK` Index price history object.
