# PETARI Documentation

## Introduction

PETARI, The Food Donate WebApp, is an initiative by an organization aiming to redistribute excess food from various events to those in need. The project aligns with India's Sustainable Development Goals to achieve a hunger-free world and zero food waste. By leveraging technology, PETARI seeks to bridge the gap between surplus food and hunger, thereby benefiting society and the environment.

## Tech Stack

### Frontend
- HTML
- CSS
- Bootstrap
- JavaScript

### Backend
- Node.js
- EJS
- Express.js
- MongoDB
- Authentication (Auth 2.0)

# Contribution Guidelines

Thank you for considering contributing to PETARI! We appreciate your efforts to make a positive impact on society through food redistribution and combating hunger. By contributing to PETARI, you are helping us move closer to our goal of creating a hunger-free world and reducing food waste.

## How Can You Contribute?

There are several ways you can contribute to PETARI:

1. **Code Contributions**: Help improve the PETARI codebase by fixing bugs, adding new features, or enhancing existing functionalities.

2. **Documentation**: Improve the project's documentation to make it more comprehensive and user-friendly.

3. **Testing**: Test the application and report any bugs or issues you encounter. You can also contribute by writing and running test cases.

4. **Design**: If you have design skills, you can contribute by creating or improving the user interface and experience of PETARI.

5. **Feedback**: Provide feedback on the existing features, suggest new ideas, or share your thoughts on how PETARI can be further improved.

## Getting Started

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
    PASS_ID = yourpassword
    ```

7. **Database**: If MongoDB is not installed on your local machine, install it. Once you run the project, databases and collections will be automatically created.

8. **Running The Project On Local Machine**: To render the website, go to

    ```
    http://localhost:3000 or http://localhost:${PORT_MENTIONED_IN_DOTENV}
    ```

9. **Make Changes**: Make your desired changes to the codebase or documentation.

10. **Test Your Changes**: Test your changes locally to ensure everything works as expected.

11. **Add your changed files**: Add changed files to the stage by running the following command:

    ```
    git add .
    ```

12. **Commit Your Changes**: Commit your changes with descriptive commit messages.

    ```
    git commit -m "message"
    ```

13. **Push Changes**: Push your changes to your forked repository.

    ```
    git push
    ```

14. **Create a Pull Request**: Open a pull request from your forked repository to the main PETARI repository. Provide a clear description of your changes in the pull request. Follow these steps
    - Add the issue number, that you have been assigned[Formate:- Isuue number #(your issue number)]
    - Brief description of the changes

## Code Style Guidelines

To maintain consistency and readability, please follow these code style guidelines:

- Use meaningful variable and function names.
- Follow indentation and formatting conventions used in the existing codebase.
- Write clear and concise comments to explain complex logic or algorithms.

## Code Review Process

All contributions to PETARI will go through a code review process to ensure code quality, consistency, and adherence to project standards. Your contributions are valuable, and we appreciate your patience during the review process.

## Community Guidelines

PETARI is committed to fostering an inclusive and welcoming community. We encourage respectful and constructive communication among contributors. Please refer to our [Code of Conduct]-(https://github.com/Sahil1786/Petari/blob/dffa12d5f33b3227ec287af602762ef1f7bc3f89/Code_of_conduct.md) for more information.


## Output Screenshot

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
