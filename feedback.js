document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();


    document.getElementById('feedbackSuccess').style.display = 'block';
    document.getElementById('feedbackError').style.display = 'none';
});