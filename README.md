# Smart Status Report Tracker

A productivity tool for logging daily achievements and managing pending tasks with Excel export capabilities.

## Features

- **Achievement Logging**: Log daily accomplishments with categories and tags
- **Task Management**: Create, track, and manage tasks with priorities and due dates
- **Excel Export**: Generate professional Excel reports for achievements and tasks
- **Offline Operation**: Works completely offline with local SQLite database
- **Web Interface**: Modern React-based user interface

## Tech Stack

- **Backend**: Python + FastAPI + SQLAlchemy + SQLite
- **Frontend**: React.js + React Router
- **Export**: openpyxl for Excel generation

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd status-tracker/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python run.py
   ```

   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd status-tracker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The application will be available at http://localhost:3000

## Usage

### Logging Achievements
1. Navigate to the Achievements page
2. Click "Log Achievement"
3. Fill in the description, select a category, and add optional tags
4. Click "Log Achievement" to save

### Managing Tasks
1. Navigate to the Tasks page
2. Click "Add Task"
3. Fill in the task description, priority, and optional due date
4. Use the status buttons to update task progress

### Exporting Reports
- Use the "Export to Excel" buttons on the Achievements and Tasks pages
- Reports include all current data with professional formatting
- Files are automatically downloaded to your default download folder

## API Endpoints

### Achievements
- `GET /api/achievements` - List all achievements
- `POST /api/achievements` - Create new achievement
- `GET /api/achievements/{id}` - Get specific achievement
- `PUT /api/achievements/{id}` - Update achievement
- `DELETE /api/achievements/{id}` - Delete achievement
- `POST /api/export/achievements` - Export achievements to Excel

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/export/tasks` - Export tasks to Excel

## Data Storage

The application uses a local SQLite database (`status_tracker.db`) stored in the backend directory. All data persists between application sessions.

## Development

### Project Structure
```
status-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # Database configuration
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── routers/         # API route handlers
│   ├── requirements.txt     # Python dependencies
│   └── run.py              # Server startup script
└── frontend/
    ├── src/
    │   ├── components/      # Reusable React components
    │   ├── pages/          # Page components
    │   └── App.js          # Main application component
    └── package.json        # Node dependencies
```

### Running Tests

Backend tests (when implemented):
```bash
cd status-tracker/backend
python -m pytest
```

Frontend tests:
```bash
cd status-tracker/frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is part of the GitHub Spec Kit toolkit. See the main project LICENSE file for details.