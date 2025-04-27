from linda_server.service_runner import run_services, watch_services
import sys

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--watch":
        watch_services()
    else:
        run_services()
