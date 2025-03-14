# FreightConnect

FreightConnect is a web application that connects shippers and truckers, allowing shippers to post jobs and truckers to place bids for transporting goods. The application consists of two main parts:
1. **Frontend & API** (Next.js)
2. **WebSocket Server** (Express.js & Socket.io)

##  Project Setup

### **Prerequisites**
- Node.js (>= 18.x)
- Next.js (>14)
- PostgreSQL (for database)
- Prisma (for ORM)
- Google OAuth using next-auth (for authentication)
- Socket.io
- Shadcn
- Tailwind

### **Installation**

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd FreightConnect
   ```

2. **Set up environment variables**
   * Create a `.env` file in the `app` and `websocket` folders by copying `.env.example`
   * Add the required values:
   ```
   DATABASE_URL=your_database_url(postgres database connection string)
   NEXTAUTH_SECRET=your_nextauth_secret(random string)
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   NEXT_PUBLIC_MAPSAPI=gomapsapikey
   WEBSOCKET_URL=websocketurl(eg. http://localhost:5000)
   NEXT_PUBLIC_WEBSOCKET_SERVER=websocketurl(eg. http://localhost:5000)
   ```
   To generate GOMAPS API KEY follow this video: https://www.youtube.com/watch?v=e1efOSDKdFM
   To generate Google Oauth Client ID and Client Secret follow this video: https://www.youtube.com/watch?v=XQbiMiNah0o&t=790s (from 13:10)

4. **Install dependencies**
   * Inside the `app` folder:
   ```sh
   cd app
   npm install
   ```
   * Inside the `websocket` folder:
   ```sh
   cd ../websocket
   npm install
   ```

5. **Run database migrations**
   ```sh
   cd app
   npx prisma migrate dev
   ```

6. **Start the application**
   * Run the Next.js app:
   ```sh
   cd app
   npm run dev
   ```
   * Run the WebSocket server:
   ```sh
   cd ../websocket
   npm run dev
   ```

##  Project Structure
```
├── app/                # Next.js frontend and backend API
├── websocket/          # WebSocket server (Express.js + Socket.io)
├── .gitignore          # Files ignored in version control
├── README.md           # Project documentation
```

##  Features
* **Authentication**: Google OAuth using `next-auth`
* **Job Posting**: Shippers can create jobs with pickup and delivery locations
* **Bidding System**: Truckers can place multiple bids for a job
* **Live Bidding Updates**: Real-time updates using WebSockets
* **Job Assignment**: The lowest bid trucker wins the job
* **Interactive Map**: Displays the route between pickup and delivery locations (Partially completed)

##  Incomplete Features 
* **Load Tracking**: Real-time tracking of loads
* **Important alerts for shippers**
* **Financial Management**
* **Benefits for Truckers**

##  AI Tools Used
* **Motiff AI**: Used for generating the design
* **v0.dev**: Used to convert design to frontend code
* **Claude & ChatGPT**: Used for troubleshooting.
