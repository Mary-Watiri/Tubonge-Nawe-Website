document.addEventListener("DOMContentLoaded", function () {
    const synth = window.speechSynthesis;
    const fileInput = document.getElementById("fileInput");
    const textInput = document.querySelector("#text-input");
    const voiceSelect = document.querySelector("#voice-select");
    const rate = document.querySelector("#speed");
    const pitch = document.querySelector("#pitch");
    const bookSelect = document.getElementById("book-select");
    const speedValue = document.querySelector("#speed-value");
    const pitchValue = document.querySelector("#pitch-value");

    let voices = [];
    const getVoices = () => {
    voices = synth.getVoices();
    voiceSelect.innerHTML = ""; 

    voices.forEach(voice => {
    const option = document.createElement("option");
    option.textContent = voice.name + " (" + voice.lang + ")";
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
        });
    };

    getVoices(); 

    if (SpeechSynthesisUtterance.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = getVoices;
    }

    // Fetch books from Google Books API when the page loads
    window.addEventListener("load", function () {
        fetchBooks();
    });

    // Function to fetch books from Google Books API
    function fetchBooks() {
        fetch('https://www.googleapis.com/books/v1/volumes?q=chess') 
          .then(response => response.json())
            .then(data => {
                // Populate the book select dropdown with book options
                data.items.forEach(book => {
                    const option = document.createElement("option");
                    option.value = book.id;
                    option.text = book.volumeInfo.title;
                    bookSelect.add(option);
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    }

    // Add an event listener to the speak button
    document.querySelector("#speakButton").addEventListener("click", function () {
        speakText();
        document.getElementById("feedbackForm").addEventListener("submit", function (event) {
            event.preventDefault(); 
    
            submitFeedback();
        });
    });
    
    
    function speakText() {
         
        const text = textInput.value;
        const utterThis = new SpeechSynthesisUtterance(text);
        const selectedOption = voiceSelect.selectedOptions[0];

        if (selectedOption) {
            const selectedVoiceName = selectedOption.getAttribute('data-name');
            const selectedVoiceLang = selectedOption.getAttribute('data-lang');

            for (const voice of voices) {
                if (voice.name === selectedVoiceName && voice.lang === selectedVoiceLang) {
                    utterThis.voice = voice;
                    break;
                }
            }
        }
            pitch.oninput = function () {
                pitchValue.textContent = pitch.value;
            };
        
            rate.oninput = function () {
                speedValue.textContent = rate.value;
            };
        

        utterThis.pitch = pitch.value;
        utterThis.rate = rate.value;

        synth.speak(utterThis);

        utterThis.onpause = function (event) {
            const char = event.utterance.text.charAt(event.charIndex);
            console.log(`Speech paused at character ${event.charIndex} of "${event.utterance.text}", which is "${char}".`);
        };

       
    }

    // Add an event listener to the Enter key for the text input
    textInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            speakText();
            event.preventDefault(); 
        }
    });

    // Add an event listener to the book select
    bookSelect.addEventListener("change", function () {
        // Fetch the selected book's details and set the text input value
        const selectedBookId = bookSelect.value;
        if (selectedBookId) {
            fetch(`https://www.googleapis.com/books/v1/volumes/${selectedBookId}`)
                .then(response => response.json())
                .then(data => {
                    textInput.value = data.volumeInfo.description;
                })
                .catch(error => console.error('Error fetching book details:', error));
        }
    });

    
    voiceSelect.addEventListener("change", function () {
    
        
    });

    // Add an event listener to the file input for key press
    fileInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            // Trigger file input click event
            fileInput.click();
        }
    });

    
    fileInput.addEventListener("change", function () {

        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                textInput.value = e.target.result;
            };
            reader.readAsText(selectedFile);
        }
    });
    //Creating a feedback form on the user experience
    const feedbackForm = document.getElementById('feedbackForm');

        feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const feedback = document.getElementById('feedback').value.trim();
        const successMessage = document.getElementById('feedbackSuccess');
        const errorMessage = document.getElementById('feedbackError');
        const feedbackForm = document.getElementById('feedbackForm');

    
        if (feedback !== '') {
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            feedbackForm.reset();
        } else {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
        }
    }); 
});
