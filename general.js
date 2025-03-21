let story;
let isMuted = false;

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const titleScreen = document.getElementById('title-screen');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const audioControlBtn = document.getElementById('audio-control-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const bgMusic = document.getElementById('background-music');
    const resetGameBtn = document.getElementById('reset-game-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const foregroundImage = document.getElementById('foreground-image');


    // Disclaimer code added here:
    const disclaimerPopup = document.getElementById('disclaimer-popup');
    const disclaimerAcceptButton = document.getElementById('disclaimer-accept-button');

    // Create and append the overlay
    const overlay = document.createElement('div');
    overlay.id = 'disclaimer-popup-overlay';
    document.body.appendChild(overlay);

    disclaimerAcceptButton.addEventListener('click', function () {
        disclaimerPopup.style.display = 'none';
        overlay.style.display = 'none'; 
        startButton.style.display = 'block'; 
    });



    // Fetch the story data from the JSON file
    fetch('./Capstone_Story.json')
        .then(response => response.json())
        .then(data => {
            console.log("JSON data loaded successfully");
            story = data.story; // Assign the story data
            // Now that the story is loaded, set up the game
            setupGame();
        })
        .catch(error => console.error('Error loading Capstone_Story.json:', error));

    function setupGame() {
        console.log("Setting up the game");
        bgMusic.src = "Audio/Quiet_Lens_Soundtrack_Option.wav";

        document.getElementById('blake-image').style.display = 'none';

        startButton.addEventListener('click', function () {
            console.log("Start button clicked");
            settingsModal.style.display = 'none';
            crossFade('Background_Images/Campus_WIP.png', () => {
                titleScreen.style.display = 'none';
                gameContainer.style.display = 'block';
                makeChoice('campus_walk_1'); // Start with the first scene
            });
        });

        audioControlBtn.addEventListener('click', function () {
            console.log("Audio control button clicked");
            isMuted = !isMuted;
            bgMusic.muted = isMuted;
            audioControlBtn.querySelector('img').src = isMuted ? 'Icons/Audio_Off_Icon.svg' : 'Icons/Audio_On_Icon.svg';
        });

        settingsBtn.addEventListener('click', function () {
            console.log("Settings button clicked");
            settingsModal.style.display = 'block';
        });

        closeBtn.addEventListener('click', function () {
            console.log("Close button clicked");
            settingsModal.style.display = 'none';
        });

        // Close modal if clicking outside
        window.addEventListener('click', function (event) {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });

        // Prevent closing when clicking inside the modal
        settingsModal.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        // Play music
        playMusic();
    }

    // Navigation Modal Setup 
    const storyNavBtn = document.getElementById('story-nav-btn');
    const navModal = document.getElementById('nav-modal');
    const navCloseBtn = navModal.querySelector('.close-btn');
    const navTitleScreenBtn = document.getElementById('nav-title-screen');
    const navAct1Btn = document.getElementById('nav-act1');
    const navAct2Btn = document.getElementById('nav-act2');
    const navAct3Btn = document.getElementById('nav-act3');

    storyNavBtn.addEventListener('click', () => {
        navModal.style.display = 'block';
    });

    navCloseBtn.addEventListener('click', () => {
        navModal.style.display = 'none';
    });

    function navigateTo(section) {
        if (section === 'Title Screen') {
            titleScreen.style.display = 'flex';
            gameContainer.style.display = 'none';
            foregroundImage.style.display = 'none';
            document.body.style.backgroundImage = "url('Background_Images/Title_Official.png')";
        } else if (section === 'Act 1 Start') {
            makeChoice('campus_walk_1');
            gameContainer.style.display = 'block';
            titleScreen.style.display = 'none';
        } else if (section === 'Act 2 Start') {
            makeChoice('dream_seq_transition'); 
            gameContainer.style.display = 'block';
            titleScreen.style.display = 'none';
        } else if (section === 'Act 3 Start') {
            makeChoice('dormfinalProj_1'); 
            gameContainer.style.display = 'block';
            titleScreen.style.display = 'none';
        }
        navModal.style.display = 'none';
    }

    navTitleScreenBtn.addEventListener('click', () => navigateTo('Title Screen'));
    navAct1Btn.addEventListener('click', () => navigateTo('Act 1 Start'));
    navAct2Btn.addEventListener('click', () => navigateTo('Act 2 Start'));
    navAct3Btn.addEventListener('click', () => navigateTo('Act 3 Start'));

    function playMusic() {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(error => {
            console.error("Audio play error:", error);
            console.log("Attempting to play audio on user interaction");
            document.addEventListener('click', () => {
                bgMusic.play().catch(retryError => {
                    console.error("Second audio play attempt failed:", retryError);
                });
            }, { once: true });
        });
    }
});

function crossFade(newBackgroundSrc, callback) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 1s ease-in-out';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);

    // Fade to black
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);

    // After fading to black, change the background and fade in
    setTimeout(() => {
        document.body.style.backgroundImage = `url('${newBackgroundSrc}')`;
        overlay.style.opacity = '0';
    }, 1100);

    // Remove overlay and execute callback
    setTimeout(() => {
        document.body.removeChild(overlay);
        if (callback) callback();
    }, 2100);
}

// Choice making logic
function makeChoice(choice) {
    if (!story[choice]) {
        console.error(`Scene "${choice}" not found in story.`);
        return;
    }

    const scene = story[choice];
    const currentBackground = document.body.style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1');
    const newBackground = scene.background;

    if (newBackground && newBackground !== currentBackground) {
        crossFade(newBackground, () => {
            updateSceneContent(scene);
        });
    } else {
        updateSceneContent(scene);
    }
}

function updateSceneContent(scene) {
    // Update the story text
    document.getElementById('story-text').innerHTML = scene.text;

    // Update choices
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    scene.choices.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('choice');
        button.innerText = option.text;
        button.onclick = () => makeChoice(option.next);
        choicesContainer.appendChild(button);
    });

    // Handle sprite
    const foregroundImage = document.getElementById('foreground-image');
    if (scene.sprite) {
        foregroundImage.src = scene.sprite;
        foregroundImage.style.display = 'block';
    } else {
        foregroundImage.style.display = 'none';
    }

    // Update Blake's image
    const npcBlake = document.getElementById('blake-image');
    if (scene.npcBlake) {
        npcBlake.src = scene.npcBlake;
        npcBlake.style.display = 'block';
    } else {
        npcBlake.style.display = 'none';
    }

        // Update Sharma's image
    const npcSharma = document.getElementById('sharma-image');
    if (scene.npcSharma) {
        npcSharma.src = scene.npcSharma;
        npcSharma.style.display = 'block';
    } else {
        npcSharma.style.display = 'none';
    }

    // Handle NPCs
    const npc1 = document.getElementById('npc1');
    const npc2 = document.getElementById('npc2');

    if (scene.npc1 && scene.npc2) {
        npc1.src = scene.npc1;
        npc2.src = scene.npc2;
        npc1.style.display = 'block';
        npc2.style.display = 'block';
    } else {
        npc1.style.display = 'none';
        npc2.style.display = 'none';
    }

    // Update the Sages image

    const imposterSage = document.getElementById('imposter-image');
    if (scene.imposterSage) {
        imposterSage.src = scene.imposterSage;
        imposterSage.style.display = 'block';
    } else {
        imposterSage.style.display = 'none';
    }

    const perfectionistSage = document.getElementById('perfectionist-image');
    if (scene.perfectionistSage) {
        perfectionistSage.src = scene.perfectionistSage;
        perfectionistSage.style.display = 'block';
    } else {
        perfectionistSage.style.display = 'none';
    }

    const pleaserSage = document.getElementById('pleaser-image');
    if (scene.pleaserSage) {
        pleaserSage.src = scene.pleaserSage;
        pleaserSage.style.display = 'block';
    } else {
        pleaserSage.style.display = 'none';
    }

    const antiSocialSage = document.getElementById('antiSocial-image');
    if (scene.antiSocialSage) {
        antiSocialSage.src = scene.antiSocialSage;
        antiSocialSage.style.display = 'block';
    } else {
        antiSocialSage.style.display = 'none';
    }
    
 // Handle hover effect for Sages (Added here)
    if (scene.imposterSage) {
        imposterSage.addEventListener('mouseover', () => {
            imposterSage.src = 'Sage_Images/SageVar6_imposter_bubble.png';
        });
        imposterSage.addEventListener('mouseout', () => {
            imposterSage.src = scene.imposterSage;
        });
    }

    if (scene.perfectionistSage) {
        perfectionistSage.addEventListener('mouseover', () => {
            perfectionistSage.src = 'Sage_Images/SageVar5_perfectionist_bubble.png';
        });
        perfectionistSage.addEventListener('mouseout', () => {
            perfectionistSage.src = scene.perfectionistSage;
        });
    }

    if (scene.pleaserSage) {
        pleaserSage.addEventListener('mouseover', () => {
            pleaserSage.src = 'Sage_Images/SageVar7_Pleaser_bubble.png';
        });
        pleaserSage.addEventListener('mouseout', () => {
            pleaserSage.src = scene.pleaserSage;
        });
    }

    if (scene.antiSocialSage) {
        antiSocialSage.addEventListener('mouseover', () => {
            antiSocialSage.src = 'Sage_Images/SageVar4_antisocial_bubble.png';
        });
        antiSocialSage.addEventListener('mouseout', () => {
            antiSocialSage.src = scene.antiSocialSage;
        });
    }

    // Handle character name box
    const nameBox = document.getElementById('character-name-box');
    const text = scene.text;

    console.log("Scene text:", text);
    console.log("Name box:", nameBox);

    if (scene.speaker) {
        nameBox.innerText = scene.speaker;
        nameBox.style.display = "block";
    } else if (text.startsWith("<em>")) {
        nameBox.innerText = "Sage";
        nameBox.style.display = "block";
        console.log("Name box display: block, name:", nameBox.innerText);
    } else {
        nameBox.style.display = "none";
        console.log("Name box display: none");
    }

    // Calculate and set the position of the character name box
    positionNameBox();
}

// Logic to position the name box correctly 
function positionNameBox() {
    const nameBox = document.getElementById('character-name-box');
    const gameContainer = document.getElementById('game-container');

    // This gets bounding elements of both rectangles
    const gameContainerRect = gameContainer.getBoundingClientRect();
    const nameBoxRect = nameBox.getBoundingClientRect();

    // This calculates the top position
    const topPosition = gameContainerRect.top - nameBoxRect.height - 10; 

    // This sets the position using transform: translate()
    nameBox.style.transform = `translate(${gameContainerRect.left}px, ${topPosition}px)`;
}

// Call positionNameBox on window resize
window.addEventListener('resize', positionNameBox);

// Settings Adjustments
document.getElementById('text-size').addEventListener('change', function () {
    const fontSize = this.value === 'small' ? '1em' : this.value === 'large' ? '1.6em' : '1.3em';
    document.getElementById('story-text').style.fontSize = fontSize;
});

document.getElementById('text-color').addEventListener('input', function () {
    document.getElementById('story-text').style.color = this.value;
});

document.getElementById('bg-opacity').addEventListener('input', function () {
    const opacity = this.value;
    document.getElementById('game-container').style.backgroundColor = `rgba(50, 50, 50, ${opacity})`;
    this.style.setProperty('--range-progress', `${opacity * 100}%`);
});

// Handle background music volume change
document.getElementById('bg-music-volume').addEventListener('input', function () {
    const volume = this.value;
    document.getElementById('background-music').volume = volume;
    this.style.setProperty('--range-progress', `${volume * 100}%`); // Add this line
});

// Reset Settings
document.getElementById('reset-btn').addEventListener('click', function () {
    document.getElementById('text-size').value = 'medium';
    document.getElementById('text-color').value = '#ffffff';
    document.getElementById('bg-opacity').value = '0.8';
    document.getElementById('bg-music-volume').value = '0.5';

    document.getElementById('story-text').style.fontSize = '1.3em';
    document.getElementById('story-text').style.color = '#ffffff';
    document.getElementById('game-container').style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
    document.getElementById('background-music').volume = '0.5';

    document.getElementById('bg-opacity').style.setProperty('--range-progress', '80%');
    document.getElementById('bg-music-volume').style.setProperty('--range-progress', '50%'); // Add this line
});

// Close Modal(s)
document.getElementById('settings-modal').querySelector('.close-btn').addEventListener('click', function () {
    document.getElementById('settings-modal').style.display = 'none';
});