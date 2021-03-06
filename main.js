class MenuItem {
    constructor(title, action, closeContext = true){
        this.title = title;
        this.action = action;
        this.closeContext = closeContext;
    }

    getItemTemplate(){
        return `
            <div class="menu-item ${this.closeContext ? '' : 'stop-propagate'}" data-action="${this.action}">
                <span class="menu-item__icon fas fa-${this.icon}"></span> 
                <span class="menu-item__title">${this.title}</span>
            </div>
        `;
    }
}


const ACTION_KEY_LEFT = 'action_left';
const ACTION_KEY_RIGHT = 'action_right';
const ACTION_KEY_TOP = 'action_top';
const ACTION_KEY_DOWN = 'action_down';
const ACTION_KEY_ADD = 'action_reset';
const ACTION_KEY_CHANGECOLOR = 'change_color';
const ACTION_KEY_RESET = 'action_change'

const ACTIONS = {
    [ACTION_KEY_LEFT]: ACTION_KEY_LEFT,
    [ACTION_KEY_RIGHT]: ACTION_KEY_RIGHT,
    [ACTION_KEY_TOP]: ACTION_KEY_TOP,
    [ACTION_KEY_DOWN]: ACTION_KEY_DOWN,
    [ACTION_KEY_ADD]: ACTION_KEY_ADD,
    [ACTION_KEY_CHANGECOLOR]: ACTION_KEY_CHANGECOLOR,
    [ACTION_KEY_RESET]: ACTION_KEY_RESET,
};


const blockMenu = [
    new MenuItem('left', ACTIONS[ACTION_KEY_LEFT]),
    new MenuItem('right', ACTIONS[ACTION_KEY_RIGHT]),
    new MenuItem('top', ACTIONS[ACTION_KEY_TOP]),
    new MenuItem('down', ACTIONS[ACTION_KEY_DOWN]),
];

const contextMenu = [
    new MenuItem('ADD/REMOVE', ACTIONS[ACTION_KEY_ADD]),
    new MenuItem('Change color', ACTIONS[ACTION_KEY_CHANGECOLOR]),
    new MenuItem('RESET', ACTIONS[ACTION_KEY_RESET])
];


let counter = 0;
function AnimatedPlayer(settings) {
    this.uID = counter++;
    this.x = settings.x;
    this.y = settings.y;
    this.size = {
        width: settings.width,
        heigth: settings.height,
    };
    this.imageSource = settings.imageSource;
    this.targetContainer = settings.targetContainer;

    this.targetContainer.innerHTML += `
        <img 
            class="player-${this.uID}" 
            src="${this.imageSource}"
            style="left:${this.x}px; top:${this.y}px; width: ${this.size.width}px; height: ${this.size.heigth}px; position: absolute; opacity: 1;"
        />
    `;
}

AnimatedPlayer.prototype.step = 10;
AnimatedPlayer.prototype.go = function(direction){
    switch(direction){
        case 'left':
            this.x = this.x - this.step;
            break;
        case 'right':
            this.x = this.x + this.step;
            break;
        case 'top':
            this.y = this.y - this.step;
            break;
        case 'bottom':
            this.y = this.y + this.step;
            break;

    }
    const img = this.targetContainer.querySelector(`img.player-${this.uID}`);
    this.rotate(direction, img);
    img.style.left = this.x + 'px';
    img.style.top = this.y + 'px';
}

AnimatedPlayer.prototype.rotate = function(direction, imageSource) {
    switch(direction){
        case 'left':
            imageSource.style.transform = 'rotateY(180deg)';
            break;
        case 'top':
            imageSource.style.transform = 'rotateZ(-90deg)';
            break;
        case 'bottom':
            imageSource.style.transform = 'rotateZ(90deg)';
            break;
        case 'right':
        default:
            imageSource.style.transform = '';
    }
}

window.addEventListener('load', () => {
    player = new AnimatedPlayer({
        x: 100,
        y: 120,
        width: 100,
        height: 200,
        imageSource: 'http://clipart-library.com/images/kTMK4knbc.png',
        targetContainer: document.body,
        position: `absolute`,
    });

    document.addEventListener('keydown', event => {
        if (event.keyCode == 37) {
            player.go('left')
        }

        if (event.keyCode == 39) {
            player.go('right')
        }

        if (event.keyCode == 38) {
            player.go('top')
        }

        if (event.keyCode == 40) {
            player.go('bottom')
        }
    })

    const target = document.body;
    const struct = {
        [ACTION_KEY_LEFT]: () => { player.go('left') },
        [ACTION_KEY_RIGHT]: () => { player.go('right') },
        [ACTION_KEY_TOP]: () => { player.go('top') },
        [ACTION_KEY_DOWN]: () => { player.go('bottom')},
        [ACTION_KEY_ADD]: () => { 
            const marioOpacity = document.querySelector('.player-0')
            if (marioOpacity.style.opacity == 0) {
                marioOpacity.style.opacity = 1;
            } else if (marioOpacity.style.opacity == 1) {
                marioOpacity.style.opacity = 0
            }
        },
        [ACTION_KEY_CHANGECOLOR]: () => {
            const marioColor = document.querySelector('.player-0')
            marioColor.style.backgroundColor = getRandomColor();
        },
        [ACTION_KEY_RESET]: () => {
            player.x = getRandomPosition();
            player.y = getRandomPosition();
    
        }
    };

    target.innerHTML += `
        <div class="context-menu default-menu">
            ${contextMenu.map(item => item.getItemTemplate()).join('')}
        </div>
        <div class="context-menu block-menu">
            ${blockMenu.map(item => item.getItemTemplate()).join('')}
        </div>
    `;

    target.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (event) => {
            const handler = struct[item.dataset.action];

            if (handler) {
                handler();
            }
        })
    });

    document.addEventListener('click', () => {
        hideContextMenu();
    });

    document.addEventListener('contextmenu', event => {
        event.preventDefault();
        const contextMenu = document.querySelector('.context-menu.default-menu');
        contextMenu.style.left = event.clientX + 'px';
        contextMenu.style.top = event.clientY + 'px';
        hideContextMenu();
        contextMenu.classList.add('show');
    });

    document.querySelector('.player-0').addEventListener('contextmenu', event => {
        event.stopPropagation();
        event.preventDefault();
        const contextMenu = document.querySelector('.context-menu.block-menu');
        contextMenu.style.left = event.clientX + 'px';
        contextMenu.style.top = event.clientY + 'px';

        hideContextMenu();

        contextMenu.classList.add('show');
    });
    
    function hideContextMenu(){
        const contextMenus = document.querySelectorAll('.context-menu');
        contextMenus.forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

function getRandomColor() {
    const colors = [
        getRand(),
        getRand(),
        getRand()
    ]
    return `rgb(${colors})`;
}

function getRand() {
    return Math.floor(Math.random()*256);
}

function getRandomPosition() {
    return Math.floor(Math.random()*600)
}