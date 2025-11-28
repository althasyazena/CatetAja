class WhiteboardApp {
    constructor() {
        this.canvas = document.getElementById('whiteboard');
        this.ctx = this.canvas.getContext('2d');
        this.currentTool = 'draw';
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.currentColor = '#ff6b6b';
        this.brushSize = 3;
        this.stickyCount = 0;


        // Simple undo system
        this.canvasStates = [];
        this.currentStateIndex = -1;


        this.init();
    }


    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupToolbar();
        this.saveCanvasState(); // Save initial state
    }


    setupCanvas() {
    this.resizeCanvas();
   
    // Enhanced line settings for smoother drawing
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.fillStyle = this.currentColor;


    // Enable high-quality rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
   
    // Enable composition for better blending
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 1.0;


    // Fill with white background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
   
    // Reset fill style for drawing
    this.ctx.fillStyle = this.currentColor;
}


    resizeCanvas() {
        // Get the actual display size
        const displayWidth = this.canvas.offsetWidth;
        const displayHeight = this.canvas.offsetHeight;
       
        // Check if the canvas is different size
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            // Set the canvas size to the display size
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
           
            // Redraw the last state to maintain quality
            if (this.restoreCanvasState) {
                this.restoreCanvasState();
            }
        }
    }


    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());


        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());


        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e.touches[0]));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
    }


    setupToolbar() {
        console.log('Setting up toolbar...');


        document.getElementById('drawBtn').addEventListener('click', () => {
            console.log('Draw button clicked');
            this.setTool('draw');
        });
       
        document.getElementById('stickyBtn').addEventListener('click', () => {
            console.log('Sticky button clicked');
            this.setTool('sticky');
        });
       
        document.getElementById('eraseBtn').addEventListener('click', () => {
            console.log('Erase button clicked');
            this.setTool('erase');
        });
       
        document.getElementById('clearBtn').addEventListener('click', () => {
            console.log('Clear button clicked');
            this.clearWhiteboard();
        });


        // Undo/Redo buttons
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());


        // Save/Load buttons
        document.getElementById('saveBtn').addEventListener('click', () => this.saveWhiteboard());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadWhiteboard());


        document.getElementById('colorPicker').addEventListener('input', (e) => {
            this.currentColor = e.target.value;
            this.ctx.strokeStyle = this.currentColor;
        });


        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.brushSize = e.target.value;
            this.ctx.lineWidth = this.brushSize;
        });


        this.canvas.addEventListener('click', (e) => {
            if (this.currentTool === 'sticky') {
                this.createStickyNote(e.clientX, e.clientY);
            }
        });


        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }


   setTool(tool) {
    this.currentTool = tool;


    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');


    if (tool === 'draw' || tool === 'erase') {
        this.canvas.classList.add('drawing-cursor');
        this.canvas.classList.remove('sticky-cursor');
    } else if (tool === 'sticky') {
        this.canvas.classList.remove('drawing-cursor');
        this.canvas.classList.add('sticky-cursor');
    }


    if (tool === 'erase') {
        this.ctx.strokeStyle = 'white';
        this.ctx.globalCompositeOperation = 'destination-out';
    } else {
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.globalCompositeOperation = 'source-over';
    }
}


    startDrawing(e) {
    if (this.currentTool === 'sticky') return;


    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;


    // Start a new path immediately
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
   
    // Draw a dot for single clicks
    this.ctx.arc(this.lastX, this.lastY, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath(); // Start new path for the line
}


draw(e) {
    if (!this.isDrawing || this.currentTool === 'sticky') return;


    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;


    // Calculate distance from last point
    const dist = Math.sqrt(
        Math.pow(currentX - this.lastX, 2) +
        Math.pow(currentY - this.lastY, 2)
    );


    // Use quadratic curves for smoother lines
    if (dist > 2) {
        const midX = (this.lastX + currentX) / 2;
        const midY = (this.lastY + currentY) / 2;


        this.ctx.quadraticCurveTo(this.lastX, this.lastY, midX, midY);
        this.ctx.stroke();
       
        this.ctx.beginPath();
        this.ctx.moveTo(midX, midY);


        this.lastX = currentX;
        this.lastY = currentY;
    }
}


stopDrawing() {
    if (this.isDrawing) {
        // Ensure the path is properly closed
        this.ctx.stroke();
        this.ctx.beginPath();
        this.saveCanvasState();
    }
    this.isDrawing = false;
}
    createStickyNote(x, y) {
        this.stickyCount++;


        const stickyColors = ['#00A3FE', '#FEA1CD', '#FECE00', '#FF7300'];
        const randomColor = stickyColors[Math.floor(Math.random() * stickyColors.length)];


        const sticky = document.createElement('div');
        sticky.className = 'sticky-note';
       
        // Get container and its position
        const container = document.querySelector('.whiteboard-container');
        const containerRect = container.getBoundingClientRect();
       
        // Convert click coordinates to container-relative coordinates
        const relativeX = x - containerRect.left;
        const relativeY = y - containerRect.top;
       
        // Sticky note dimensions
        const stickyWidth = 200;
        const stickyHeight = 150;
       
        // Calculate initial position (centered on click)
        let initialLeft = relativeX - (stickyWidth / 2);
        let initialTop = relativeY - (stickyHeight / 2);
       
        // Constrain initial position to container
        const minX = 10;
        const minY = 10;
        const maxX = containerRect.width - stickyWidth - 10;
        const maxY = containerRect.height - stickyHeight - 10;
       
        initialLeft = Math.max(minX, Math.min(initialLeft, maxX));
        initialTop = Math.max(minY, Math.min(initialTop, maxY));
       
        sticky.style.left = initialLeft + 'px';
        sticky.style.top = initialTop + 'px';
        sticky.style.width = stickyWidth + 'px';
        sticky.style.height = stickyHeight + 'px';
        sticky.style.backgroundColor = randomColor;
        sticky.style.cursor = 'grab';


        sticky.innerHTML = `
            <div class="sticky-header">
                <button class="delete-btn">×</button>
            </div>
            <textarea class="sticky-content" placeholder="Write your note here..."></textarea>
        `;


        container.appendChild(sticky);
        this.makeDraggable(sticky);


        sticky.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            sticky.remove();
        });


        sticky.querySelector('.sticky-content').focus();
    }


    makeDraggable(element) {
        let startX, startY, initialX, initialY;
        const header = element.querySelector('.sticky-header');
        const container = document.querySelector('.whiteboard-container');


        header.onmousedown = dragStart;


        function dragStart(e) {
            e.preventDefault();
           
            // Get initial positions
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
           
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }


        function drag(e) {
            e.preventDefault();
           
            // Calculate new position
            let newX = initialX + (e.clientX - startX);
            let newY = initialY + (e.clientY - startY);
           
            // Get boundaries
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
           
            // Constrain to container boundaries with 5px margin
            const margin = 5;
            newX = Math.max(margin, Math.min(newX, containerRect.width - elementRect.width - margin));
            newY = Math.max(margin, Math.min(newY, containerRect.height - elementRect.height - margin));
           
            // Apply position
            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
        }


        function dragEnd() {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }
    }


    // Simple undo/redo methods
    undo() {
        if (this.currentStateIndex > 0) {
            this.currentStateIndex--;
            this.restoreCanvasState();
        }
        this.updateUndoRedoButtons();
    }


    redo() {
        if (this.currentStateIndex < this.canvasStates.length - 1) {
            this.currentStateIndex++;
            this.restoreCanvasState();
        }
        this.updateUndoRedoButtons();
    }


    restoreCanvasState() {
    if (this.currentStateIndex >= 0 && this.canvasStates[this.currentStateIndex]) {
        const state = this.canvasStates[this.currentStateIndex];
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.onerror = () => {
            console.error('Failed to restore canvas state');
            // Fill with white as fallback
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = state;
    }
}


    updateUndoRedoButtons() {
        document.getElementById('undoBtn').disabled = this.currentStateIndex <= 0;
        document.getElementById('redoBtn').disabled = this.currentStateIndex >= this.canvasStates.length - 1;
    }


    // Update clearWhiteboard to save state
    clearWhiteboard() {
        if (confirm('Are you sure you want to clear everything? 💥')) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


            document.querySelectorAll('.sticky-note').forEach(note => note.remove());
            this.stickyCount = 0;


            this.saveCanvasState(); // Save after clear
        }
    }


   saveCanvasState() {
    try {
        const state = this.canvas.toDataURL();
       
        if (!state || state === 'data:,') {
            console.error('Failed to capture canvas state');
            return;
        }


        // Remove future states if we undo and then draw something new
        if (this.currentStateIndex < this.canvasStates.length - 1) {
            this.canvasStates = this.canvasStates.slice(0, this.currentStateIndex + 1);
        }


        this.canvasStates.push(state);
        this.currentStateIndex = this.canvasStates.length - 1;


        this.updateUndoRedoButtons();
    } catch (error) {
        console.error('Error saving canvas state:', error);
    }
}


    // Save functionality
    saveWhiteboard() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
       
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
       
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(this.canvas, 0, 0);
       
        const imageDataURL = tempCanvas.toDataURL('image/png');
       
        const link = document.createElement('a');
        link.download = 'whiteboard-' + new Date().toISOString().slice(0, 10) + '.png';
        link.href = imageDataURL;
       
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
       
        this.showNotification('Whiteboard saved successfully! ✅', 'success');
    }


    // Load functionality
   loadWhiteboard() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png,image/jpeg,image/jpg';
   
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
           
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Reset to normal drawing mode before loading image
                    this.ctx.globalCompositeOperation = 'source-over';
                   
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                    this.saveCanvasState();
                    this.showNotification('Whiteboard loaded successfully! 🎉', 'success');
                   
                    // Restore the appropriate composite operation based on current tool
                    if (this.currentTool === 'erase') {
                        this.ctx.globalCompositeOperation = 'destination-out';
                    } else {
                        this.ctx.globalCompositeOperation = 'source-over';
                    }
                };
                img.src = event.target.result;
            };
           
            reader.readAsDataURL(file);
        }
    };
   
    fileInput.click();
}


    showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.save-notification');
        existingNotifications.forEach(notif => notif.remove());
       
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = message;
       
        if (type === 'error') {
            notification.style.background = '#f44336';
        } else if (type === 'warning') {
            notification.style.background = '#ff9800';
        } else {
            notification.style.background = '#4CAF50';
        }
       
        document.body.appendChild(notification);
       
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}


// Only initialize once
document.addEventListener('DOMContentLoaded', () => {
    new WhiteboardApp();
});


// Hide loading screen when whiteboard is ready
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
   
    // Start the image sequence animation
    if (typeof startImageSequence === 'function') {
        startImageSequence();
    }
   
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 3000);
});


// Image sequence animation function
function startImageSequence() {
    const images = document.querySelectorAll('.loading-image');
    let currentIndex = 0;
   
    // Reset all images first
    images.forEach(img => {
        img.classList.remove('active', 'pop');
    });
   
    // Show first image immediately
    if (images[0]) {
        images[0].classList.add('active', 'pop');
    }
   
    // Sequence through images with slower timing
    const sequenceInterval = setInterval(() => {
        // Remove active class from current image
        images[currentIndex].classList.remove('active', 'pop');
       
        // Move to next image
        currentIndex = (currentIndex + 1) % images.length;
       
        // Add active class to next image with pop effect
        images[currentIndex].classList.add('active', 'pop');
       
    }, 800); // Changed from 400ms to 800ms for slower transitions
}
