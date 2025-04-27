#!/usr/bin/env python
"""
Convenience script to start just the animation server.
Useful for testing and development.
"""
import logging
import time
import signal
import sys
from linda_server.utils.animation_server_runner import start_animation_server_sync, get_animation_server_url

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Run the animation server"""
    try:
        logger.info("Starting animation server...")
        
        # Start the animation server
        process = start_animation_server_sync()
        
        if not process:
            logger.error("Failed to start animation server")
            return 1
        
        # Setup signal handler for clean shutdown
        def signal_handler(sig, frame):
            logger.info("Shutting down animation server...")
            process.terminate()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        logger.info(f"Animation server is running at {get_animation_server_url()}")
        logger.info("Press Ctrl+C to stop")
        
        # Keep the script running
        while True:
            time.sleep(1)
            
            # Check if the process is still running
            if process.poll() is not None:
                logger.error(f"Animation server exited unexpectedly with code {process.returncode}")
                return process.returncode
                
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
    except Exception as e:
        logger.exception(f"Error running animation server: {e}")
        return 1
    finally:
        # Make sure we clean up
        if 'process' in locals() and process and process.poll() is None:
            process.terminate()
            logger.info("Animation server stopped")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
