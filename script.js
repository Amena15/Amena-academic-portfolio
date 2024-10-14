window.onload = function() {
    window.scrollTo(0, 0); // Scroll to the top of the page
};

 // Typing effect code
 const text = "Welcome to My Tech Oasis"; // The text you want to type out
 const typingElement = document.getElementById("typing-effect"); // Get the h1 element

 let index = 0; // Initialize the index

 // Set the typing speed (in milliseconds)
 const typingSpeed = 100;

 // Use setInterval to type out the text
 const typingInterval = setInterval(() => {
     if (index < text.length) {
         typingElement.innerHTML += text.charAt(index); // Add the next character
         index++;
     } else {
         clearInterval(typingInterval); // Stop the interval when done
     }
 }, typingSpeed);

// Select all elements with the class 'accordion-btn'
document.querySelectorAll('.accordion-btn').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const isVisible = content.style.display === 'block';

        // Toggle the display property
        content.style.display = isVisible ? 'none' : 'block';

        // Toggle the button text to show if the content is expanded or collapsed
        button.innerHTML = isVisible ? `${button.textContent.replace(' ▲', ' ▼')}` : `${button.textContent.replace(' ▼', ' ▲')}`;
    });
});


