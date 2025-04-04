const slider = document.querySelector(".slider");
const sliderDigit = document.querySelector(".char-length-digit");
const passwordDisplay = document.querySelector(".password-placeholder");

const copyBtn = document.querySelector(".copy-btn");
const copiedText = document.querySelector(".copied-text");

const generateBtn = document.querySelector(".generate-btn");
const checkboxes = document.querySelectorAll(".checkbox");
const passwordStrength = document.querySelector(".strength-rating-text");
const bars = document.querySelectorAll(".bar");
const bar1 = document.querySelector(".bar1");
const bar2 = document.querySelector(".bar2");
const bar3 = document.querySelector(".bar3");
const bar4 = document.querySelector(".bar4");

const setOfCharacters = {
    uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
    lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
    numbers: ["0123456789", 10],
    symbols: ["!@#$%^&*()_+[]{}|;:,.<>?", 24]
};



let charPool = [];
let guaranteedCharacters = [];
let password = [];





// Update the digit display and slider background
const updateDigit = () => {
    sliderDigit.textContent = slider.value;
}

// Update the slider background
const updateSlider = () => {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, var(--Green) ${value}%, var(--Grey-850) ${value}%)`;
}

// Event listener for slider input
slider.addEventListener("input", () => {
    updateSlider();
    updateDigit();

});


const shuffleArray = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at index i and j
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};


const checkPassStrength = (password) => {

    let strength = 0;

    if (password.length >= 8) {
        strength += 1;
    };

    if (password.length >= 12) {
        strength += 1;
    };

    if (password.length >= 16) {
        strength += 1;
    };

    if (password.match(/[A-Z]/)) {
        strength += 1;
    };

    if (password.match(/[a-z]/)) {
        strength += 1;
    };

    if (password.match(/\d/)) {
        strength += 1;
    };

    if (password.match(/[^a-zA-Z\d]/)) {
        strength += 1;
    };

    console.log("Password strength is: ", strength);


    if (strength <= 1) {
        passwordStrength.innerText = "TOO WEAK!"
    } else if (strength <= 2) {
        passwordStrength.innerText = "WEAK"
    } else if (strength <= 4) {
        passwordStrength.innerText = "MEDIUM"
    } else {
        passwordStrength.innerText = "STRONG"
    }
    passwordStrength.style.opacity = "1";
    changeBarColor(strength);

};

const changeBarColor = (strength) => {

    if (strength <= 1) {
        bar1.style.backgroundColor = "var(--Red-500)";
        bar1.style.borderColor = "var(--Red-500)";

    } else if (strength <= 2) {
        for (let i = 1; i <= 2; i++) {
            const bar = document.querySelector(`.bar${i}`);
            bar.style.backgroundColor = "var(--Orange-400)";
            bar.style.borderColor = "var(--Orange-400)";
        }

    } else if (strength <= 4) {

        for (let i = 1; i <= 3; i++) {
            const bar = document.querySelector(`.bar${i}`);
            bar.style.backgroundColor = "var(--Yellow-300)";
            bar.style.borderColor = "var(--Yellow-300)";
        }

    } else if (strength > 4) {
        bars.forEach(bar => {
            bar.style.backgroundColor = "var(--Green)";
            bar.style.borderColor = "var(--Green)";
        })
    }

};



const resetBarsColor = () => {
    bars.forEach(bar => {
        bar.style.backgroundColor = "var(--Grey-850)";
        bar.style.borderColor = "var(--Grey-200)";
    });
};



// Event listener for checkboxes
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        // Rebuild charPool and guaranteedCharacters when checkbox is changed
        rebuildCharacterSets();
    });
});


// Rebuild the character sets based on checked checkboxes
const rebuildCharacterSets = () => {
    // Reset charPool and guaranteedCharacters every time
    charPool = [];
    guaranteedCharacters = [];


    // Add characters based on checked checkboxes
    checkboxes.forEach((checkbox) => {
        const checkboxValue = checkbox.value; // Store the checkbox value
        if (checkbox.checked) {

            const randomIndex = Math.floor(Math.random() * setOfCharacters[checkboxValue][1]);

            // Add one guaranteed character from the selected set
            guaranteedCharacters.push(setOfCharacters[checkboxValue][0][randomIndex]);

            // Add all characters of this set to the charPool
            charPool.push(...setOfCharacters[checkboxValue][0].split(''));
        } else {
            //console.log("Unhecked box: ", checkboxValue);

            // Remove the characters associated with the unchecked box from charPool
            charPool = charPool.filter(char => !setOfCharacters[checkboxValue][0].includes(char));

            //console.log("after unchecking, Charpool array is now: ", charPool);
            guaranteedCharacters = guaranteedCharacters.filter(char => !setOfCharacters[checkboxValue][0].includes(char));
        }
    });

};


copyBtn.addEventListener("click", () => {
    // Copy generated password to clipboard
    navigator.clipboard.writeText(passwordDisplay.textContent);
    copiedText.classList.add("show")
    setTimeout(() => {
        copiedText.classList.remove("show");
    }, 2000);

});


generateBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Reset charPool and guaranteedCharacters before generating a new password
    rebuildCharacterSets();
    resetBarsColor();
    generatePassword();

});



const adjustFontSize = () => {
    const screenWidth = window.innerWidth;
    const textLength = passwordDisplay.textContent.length;
    console.log("Password text length: ", textLength); // Debugging

    // Check screen width 
    if (screenWidth <= 550) { // For mobile or smaller screens
        if (textLength > 18) { // So the copied text doesn't overlap with the generated password
            passwordDisplay.style.fontSize = "16px";
        } else {
            passwordDisplay.style.fontSize = "18px";
        }
    } else { // For larger screens (desktop/tablet)
        if (textLength > 18) { // So the copied text doesn't overlap with the generated password
            passwordDisplay.style.fontSize = "29px";
        } else {
            passwordDisplay.style.fontSize = "32px";
        }
    }
};

window.addEventListener("resize", () => {
    adjustFontSize();
})



generatePassword = () => {
    const passLength = slider.value;
    password = [...guaranteedCharacters];
    const remainingCharacters = passLength - guaranteedCharacters.length;

    if (remainingCharacters > 0) {
        for (let i = 0; i < remainingCharacters; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            password.push(charPool[randomIndex]);
        }
        console.log("Generated Password (with remaining chars):", password);
    } else {

        password = shuffleArray(guaranteedCharacters);
        //If number of checked boxes is less than slider value, slice the password to match the length of slider value

        password = password.slice(0, passLength);
    }

    password = shuffleArray(password);
    password = password.join("");
    console.log("Final password: ", password);
    passwordDisplay.textContent = password;
    passwordDisplay.style.color = "#E6E5EA";

    /*
        // Check screen width
        const screenWidth = window.innerWidth;
    
        // Apply different font sizes based on screen width
        if (screenWidth <= 550) { // For mobile or smaller screens
            if (password.length > 18) {
                passwordDisplay.style.fontSize = "16px"; // Smaller font size for mobile and longer passwords
            } else {
                passwordDisplay.style.fontSize = "18px"; // Default smaller font size for mobile
            }
        } else { // For larger screens (desktop/tablet)
            if (password.length > 18) {
                passwordDisplay.style.fontSize = "29px"; // Smaller font size for larger screens and longer passwords
            } else {
                passwordDisplay.style.fontSize = "32px"; // Default larger font size for larger screens
            }
        }         */


    checkPassStrength(password);
}



