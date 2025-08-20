const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-button');
const profileContainer = document.querySelector('#profile-container');
const errorContainer = document.querySelector('#error-container');
const avatar = document.querySelector('#avatar');
const nameElement = document.querySelector('#name');
const usernameElement = document.querySelector("#username");
const bioElement = document.querySelector("#bio");
const locationElement = document.querySelector("#location");
const joinedDateElement = document.querySelector("#date");
const profileLink = document.querySelector("#profile-link");
const followers = document.querySelector("#followers");
const following = document.querySelector("#following");
const repos = document.querySelector("#repos");
const companyElement = document.querySelector("#company");
const blogElement = document.querySelector("#blog");
const twitterElement = document.querySelector("#x");
const companyContainer = document.querySelector("#company-container");
const blogContainer = document.querySelector("#blog-container");
const twitterContainer = document.querySelector("#x-container");
const reposContainer = document.querySelector("#repos-container");
const reposLoading = document.querySelector("#repos-load");
const reposNotLoading = document.querySelector("#repos-no-load");
const repoTemplate = document.querySelector("#repo-template");




searchBtn.addEventListener('click', searchUser);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchUser();
    }
});

async function searchUser() {
    const username = searchInput.value.trim();
    if (!username) {
        alert('Please enter a username to search.');
        return;
    }

    try {
        profileContainer.classList.add('hidden');
        errorContainer.classList.add('hidden');

        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error('User not found');
        }

        const userData = await response.json();
        console.log("userdata:", userData);

        displayUserData(userData);

    } catch (error) {
        showError();
    }
}

function showError() {
    profileContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
}

//Default search
searchInput.value = "shauv-k"
searchUser();


function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function displayUserData(user) {
    avatar.src = user.avatar_url;
    nameElement.textContent = user.name || user.login;
    usernameElement.textContent = `@${user.login}`;

    bioElement.textContent = user.bio || 'No bio available';
    locationElement.textContent = user.location || 'Not specified';
    joinedDateElement.textContent = formatDate(user.created_at);

    profileLink.href = user.html_url;
    followers.textContent = user.followers;
    following.textContent = user.following;
    repos.textContent = user.public_repos;

    if (user.company) companyElement.textContent = user.company;
    else companyElement.textContent = "Not specified";

    if (user.blog) {
        blogElement.textContent = user.blog;
        blogElement.href = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
    } else {
        blogElement.textContent = "No website";
        blogElement.href = "#";
    }

    if (user.twitter_username) {
        twitterElement.textContent = `@${user.twitter_username}`;
        twitterElement.href = `https://twitter.com/${user.twitter_username}`;
    } else {
        twitterElement.textContent = "No Twitter";
        twitterElement.href = "#";
    }


    // show the profile
    profileContainer.classList.remove("hidden");

    fetchRepos(user.repos_url);
}

async function fetchRepos(reposUrl) {
    try{
        const reposResponse = await fetch(reposUrl);
        const reposData = await reposResponse.json();
        displayRepos(reposData);
    }
    catch (error) {
        console.error('Error fetching repositories:', error);
        reposLoading.classList.add('hidden');
        reposNotLoading.classList.remove('hidden');
    }
}

function displayRepos(repos) {
    reposLoading.classList.add('hidden');
    reposNotLoading.classList.add('hidden');
    reposContainer.innerHTML = "";

    if (repos.length === 0) {
        reposNotLoading.classList.remove('hidden');
        return;
    }

    repos.forEach(repo => {
        const card = repoTemplate.content.cloneNode(true);

        card.querySelector(".repo-name").href = repo.html_url;
        card.querySelector(".repo-title").textContent = repo.name;
        card.querySelector(".repo-description").textContent = repo.description || "No description available";

        if (repo.language) {
            card.querySelector(".language").classList.remove("hidden");
            card.querySelector(".repo-language").textContent = repo.language;
        }

        card.querySelector(".repo-stars").textContent = repo.stargazers_count;
        card.querySelector(".repo-forks").textContent = repo.forks_count;
        card.querySelector(".repo-updated").textContent = formatDate(repo.updated_at);

        reposContainer.appendChild(card);
    });
}
