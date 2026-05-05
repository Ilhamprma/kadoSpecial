const fs = require('fs');

let content = fs.readFileSync('c:/Users/ILHAM/Documents/game/birthday.html', 'utf8');

// Find the broken part at the end
const brokenMarker = "// Override closeTutorial in birthday.html to show the card instead of redirecting";
const brokenIdx = content.indexOf(brokenMarker);

if (brokenIdx !== -1) {
    // The correct ending should be:
    // Close the DOMContentLoaded listener } );
    // And then the final closeTutorial function
    const fixedEnd = `
});

// Final consolidated closeTutorial function
function closeTutorial() {
    const o = document.getElementById('tutorialOverlay');
    if (o) {
        o.style.transition = 'opacity 0.5s ease';
        o.style.opacity = '0';
        setTimeout(() => {
            o.style.display = 'none';
            localStorage.setItem('tutorialDone', 'true');
            const wrapper = document.querySelector('.card-container');
            if (wrapper) {
                // Smooth fade back to the main card
                wrapper.style.opacity = '0';
                wrapper.style.display = 'flex';
                setTimeout(() => {
                    wrapper.style.opacity = '1';
                }, 50);
            }
        }, 500);
    }
}
</script>
</body>
</html>`;

    // Remove everything from the broken marker to the end
    content = content.substring(0, brokenIdx) + fixedEnd;
    
    // Also, let's remove any previous closeTutorial definitions to avoid duplicates crashing the script
    content = content.replace(/function closeTutorial\(\)\{.*?\}\n/gs, ''); 
    // Actually, I should be more precise.
    // Let's re-run a clean replacement.
}

// Clean duplicate function definitions that might exist in the middle
content = content.replace(/function closeTutorial\(\)\{.*?setTimeout\(.*?\},500\);\n\}\n/gs, '');

fs.writeFileSync('c:/Users/ILHAM/Documents/game/birthday.html', content, 'utf8');
console.log('Birthday.html syntax fixed.');
