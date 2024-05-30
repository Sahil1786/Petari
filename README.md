# <p align="center"> Petari - The Food Donation Management System</p>
<div id="top"></div>
<h2>Table of Contents</h2>

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
   <br>
  - [Frontend](#frontend)<br>
  - [Backend](#backend)
- [Features](#features)
- [Contribution Guidelines](#contribution-guidelines)
  - [How Can You Contribute?](#how-can-you-contribute)
- [Getting Started](#getting-started)
- [Code Style Guidelines](#code-style-guidelines)
- [Code Review Process](#code-review-process)
- [Community Guidelines](#community-guidelines)
- [Output Screenshot](#output-screenshot)
<br>

## Introduction
<a name="introduction"></a>
PETARI, The Food Donate WebApp, is an initiative by an organization aiming to redistribute excess food from various events to those in need. The project aligns with India's Sustainable Development Goals to achieve a hunger-free world and zero food waste. By leveraging technology, PETARI seeks to bridge the gap between surplus food and hunger, thereby benefiting society and the environment.

## Tech Stack
<a v="tech-stack"></a>
### Frontend

<a F="frontend"></a>
<p>
  <a href="https://www.w3schools.com/html/"> <img src="https://img.icons8.com/color/70/000000/html-5--v1.png" alt="HTML" /></a>
  <a href="https://www.w3schools.com/css/"> <img src="https://img.icons8.com/color/70/000000/css3.png" alt="CSS" /></a>
  <a href="https://www.w3schools.com/js/"><img src="https://img.icons8.com/color/70/000000/javascript--v1.png" alt="JS" /></a>
  <a href="https://getbootstrap.com/docs/5.0/getting-started/introduction/"> <img src="https://img.icons8.com/color/70/000000/bootstrap.png" alt="Bootstrap" /></a>

</p>

### Backend
<a m="backend"></a>
<a href="https://www.w3schools.com/nodejs/"><img src="https://e7.pngegg.com/pngimages/247/558/png-clipart-node-js-javascript-express-js-npm-react-github-angle-text.png" alt="Node.js" width="50" height="50" /></a>
<a href="https://www.javatpoint.com/expressjs-tutorial"><img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/expressjs_logo_icon_169185.png" alt="expressjs" width="50" height="50" /></a>
<a href="https://www.mongodb.com/docs/"><img src="https://w7.pngwing.com/pngs/956/695/png-transparent-mongodb-original-wordmark-logo-icon-thumbnail.png" alt="MongoDB" width="50" height="50" /></a>
<a href="https://www.npmjs.com/package/ejs"><img src="https://icons.veryicon.com/png/o/business/vscode-program-item-icon/ejs.png" alt="EJS" width="50" height="50" /></a>
<a href="https://oauth.net/2/"><img src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*e2x6biTeTNWeMc-C4aPogw.jpeg" alt="Auth2.0" width="70" height="60" /></a>

<p align="right">(<a href="#top">back to top</a>)</p>

# Features
<a c="features"></a>
- <h4>Redistribution of Excess Food:</h4>
  Petari focuses on collecting excess food from weddings, parties, and events to redistribute it to individuals who are hungry, thereby reducing food waste and ensuring that surplus food benefits those in need.
- <h4>Societal Impact:</h4> The organization aims to bring benefits across society by providing access to food for individuals who may not have adequate means to access it, addressing food insecurity and hunger issues.
- <h4>Alignment with Sustainable Development Goals: </h4>Petari's mission aligns with India's Sustainable Development Goals, particularly focusing on making the world hunger-free and reducing food waste to contribute to a sustainable and equitable society.
- <h4>Environmental Consciousness: </h4> By redistributing excess food and reducing food waste, Petari helps alleviate the pressure on finite natural resources and minimizes the environmental impact associated with food wastage.
- <h4>Economic Impact:</h4> Through its activities, Petari not only addresses social issues related to hunger but also contributes to economic sustainability by efficiently utilizing excess resources and reducing wastage.
- <h4>Collaboration with Events:</h4> Petari likely collaborates with various events, such as weddings and parties, to collect surplus food, emphasizing the importance of partnerships and community involvement in achieving its goals.

<p align="right">(<a href="#top">back to top</a>)</p>


# Contribution Guidelines
<a g="contribution-guidelines"></a>
Thank you for considering contributing to PETARI! We appreciate your efforts to make a positive impact on society through food redistribution and combating hunger. By contributing to PETARI, you are helping us move closer to our goal of creating a hunger-free world and reducing food waste.

## How Can You Contribute?
<a h="how-can-you-contribute"></a>
There are several ways you can contribute to PETARI:

1. **Code Contributions**: Help improve the PETARI codebase by fixing bugs, adding new features, or enhancing existing functionalities.

2. **Documentation**: Improve the project's documentation to make it more comprehensive and user-friendly.

3. **Testing**: Test the application and report any bugs or issues you encounter. You can also contribute by writing and running test cases.

4. **Design**: If you have design skills, you can contribute by creating or improving the user interface and experience of PETARI.

5. **Feedback**: Provide feedback on the existing features, suggest new ideas, or share your thoughts on how PETARI can be further improved.

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started
<a h="getting-started"></a>
If you're new to contributing to open-source projects, don't worry! Here's how you can get started:

1. **Fork the Repository**: Fork the PETARI repository to your GitHub account.

2. **Clone the Repository**: Clone the forked repository to your local machine using Git.

    ```
    git clone https://github.com/your-username/Petari.git
    ```

3. **Open project**: Open the project directory.

    ```
    cd Petari
    ```

4. **Create a new branch**: To create a new branch for your profile, run the following command:

    ```
    git checkout -b add-profile
    ```

5. **Setting up Project**: Once you are in the Project directory, run this command to install all necessary npm modules

    ```
    npm install
    ```

6. **Setting up dotenv file**: In the Project directory, create a file named ".env". Now add the following data to it

    ```
    PORT=3000
    ACCESS_TOKEN_SECRET = youraccesstokensecret
    MAIL_ID = yourmailid
    PASS_ID = your gamil app password 
    ```

7. **Database**: If MongoDB is not installed on your local machine, install it. Once you run the project, databases and collections will be automatically created. For installation, you can follow the installation manual given on the MongoDB website for your respective operating system:

    [MongoDB Installation Manual](https://www.mongodb.com/docs/manual/installation/)

    Once installation is done, open your terminal:
    - If you have installed MongoDB as a service, run this command to open the  MongoDB Shell:
    
        ```
        mongosh  
        ```
    
    - Otherwise, you can run MongoDB Community Edition from the Windows command     prompt instead of as a service. Open the command prompt, navigate to the    MongoDB directory (e.g., `C:\Program Files\MongoDB\Server\<version>\bin`),     and run this command:
    
        ```
        mongod
        ``` 
    
      This will start the MongoDB service. Don't close this terminal window     while you are working on the project. Now run this command to open the  MongoDB Shell in a new command prompt window/tab:
    
        ```
        mongosh  
        ```

    Once MongoDB is running as a service, proceed to the next step.

8. **Running The Project On Local Machine**: To run the project, navigate to the project directory. Now run the command:  

    ```
    nodemon app.js 
    ```

    If the above command gives an error, run this command:

    ```
    npx nodemon app.js
    ```

    Once the server starts listening, to render the webpage, go to:

    ```
    http://localhost:${PORT_MENTIONED_IN_DOTENV} or http://localhost:3000
    ```

9. **Checking Database**: After running the project for the first time, databases and collections will be automatically created. To check if they are properly made, open the MongoDB Shell and run these commands:

    ```
    show dbs
    ```

    You will find a database named `PetariDB`. Now, run this command in the MongoDB Shell to use that database:

    ```
    use PetariDB
    ```

    To check collections inside the PetariDB, run this command in the MongoDB Shell:

    ```
    show collections
    ```

    You will see 4 collections inside the PetariDB: `admins`, `ngos`, `queries`, `users`.
    
10. **Make Changes**: Make your desired changes to the codebase or documentation.

11. **Test Your Changes**: Test your changes locally to ensure everything works as expected.

12. **Add your changed files**: Add changed files to the stage by running the following command:

    ```
    git add .
    ```

13. **Commit Your Changes**: Commit your changes with descriptive commit messages.

    ```
    git commit -m "message"
    ```

14. **Push Changes**: Push your changes to your forked repository.

    ```
    git push
    ```

15. **Create a Pull Request**: Open a pull request from your forked repository to the main PETARI repository. Provide a clear description of your changes in the pull request. Follow these steps
    - Add the issue number, that you have been assigned[Formate:- Isuue number #(your issue number)]
    - Brief description of the changes
   
    <p align="right">(<a href="#top">back to top</a>)</p>

## Code Style Guidelines
<a h="code-style-guidelines"></a>
To maintain consistency and readability, please follow these code style guidelines:

- Use meaningful variable and function names.
- Follow indentation and formatting conventions used in the existing codebase.
- Write clear and concise comments to explain complex logic or algorithms.

## Code Review Process
<a k="code-review-process"></a>
All contributions to PETARI will go through a code review process to ensure code quality, consistency, and adherence to project standards. Your contributions are valuable, and we appreciate your patience during the review process.

## Community Guidelines

<a j="community-guidelines"></a>
PETARI is committed to fostering an inclusive and welcoming community. We encourage respectful and constructive communication among contributors. Please refer to our [Code of Conduct]-(https://github.com/Sahil1786/Petari/blob/dffa12d5f33b3227ec287af602762ef1f7bc3f89/Code_of_conduct.md) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


## Output Screenshot
<a i="output-screenshot"></a>
### 1. Index Page
The index page serves as the main landing page for PETARI. It showcases the mission and purpose of the organization, along with relevant information about its activities.

![Index Page](https://github.com/Sahil1786/Petari/assets/111786720/7725fc9d-429b-415c-b3ca-bd2d8518233a)

### 2. Contact Page
This page allows users to get in touch with PETARI for inquiries, collaborations, or any other relevant communication. It provides contact information and possibly a contact form for convenience.

![Contact Page](https://github.com/Sahil1786/Petari/assets/111786720/1a40bb53-57ce-49ff-bb38-b55179c53a3e)

### 3. User Login
Users can log in to their accounts on PETARI's platform. This feature enables users to access personalized services, such as tracking their donations, managing their profiles, and more.

![User Login Page](https://github.com/Sahil1786/Petari/assets/111786720/5ecb087b-c96a-4af7-b4a8-c7c3a7ba594d)

### 4. Admin Login
Admins have special privileges and access to manage the platform. The admin login page provides authentication for authorized personnel to perform administrative tasks, such as managing user accounts, overseeing donations, and maintaining the system.

![Admin Login Page](https://github.com/Sahil1786/Petari/assets/111786720/fb1cc46a-e3ad-40fd-93c6-268849e05e91)

**Please follow me and give a star to my repository 
<p align="right">(<a href="#top">back to top</a>)</p>

