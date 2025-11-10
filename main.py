from app import create_app
from app.scheduler import start_scheduler
import threading

app = create_app()

# Start scheduler in background thread
scheduler_thread = threading.Thread(target=start_scheduler, daemon=True)
scheduler_thread.start()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
