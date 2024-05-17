# Contributing Guidelines

Please "star" this repo before you begin!
When contributing to this repository, it is essential to first discuss the proposed changes with the project maintainers via 'ISSUE' to ensure alignment with the project's goals.

Go through the Readme.md file and kindly adhere to our Code of Conduct during all interactions within the project.

### Pull Request Process

1. **Dependency Management**: Before concluding a build, ensure that all installation or build dependencies are removed. Commit only relevant files to maintain repository cleanliness, disregarding the rest.

2. **Update README.md**: Detail any changes to the interface in the README.md file. This includes information such as new environment variables, exposed ports, useful file locations, and container parameters.

3. **Review Request**: Once a Pull Request (PR) is submitted, request a review from the project maintainers to facilitate timely feedback and integration.

### Git Workflow

#### Step 1: Fork Repository

#### Step 2: Git Setup & Repository Download

```bash
# Clone the repository
$ git clone https://github.com/<User-Name>/<Repo-Name>.git

# Add upstream remote
$ git remote add upstream https://github.com/<User-Name>/git-re.git

# Fetch and merge with upstream/master
$ git fetch upstream
$ git merge upstream/master
```

#### Step 3: Create and Publish Working Branch

```bash
$ git checkout -b <type>/<issue|issue-number>/{<additional-fixes>}
$ git push origin <type>/<issue|issue-number>/{<additional-fixes>}
```

**Types:**
- `wip`: Work in Progress; mainstream changes; long-term work.
- `feat`: New Feature; non-mainstream changes; future planned.
- `bug`: Bug Fixes.
- `exp`: Experimental; random experimental features.

#### On Task Completion

```bash
# Ensure on the branch
$ git branch

# Fetch and merge with upstream/master
$ git fetch upstream
$ git merge upstream/master

# Add untracked files
$ git add .

# Commit changes with appropriate message and description
$ git commit -m "your-commit-message" -m "your-commit-description"

# Fetch and merge with upstream/master again
$ git fetch upstream
$ git merge upstream/master

# Push changes to your forked repository
$ git push origin <type>/<issue|issue-number>/{<additional-fixes>}
```

#### Creating the Pull Request (PR) using the GitHub Website

- Create a PR from `<type>/<issue|issue-number>/{<additional-fixes>}` branch in your forked repository to the master branch in the upstream repository.
- After creating the PR, add a Reviewer (Any Admin) and yourself as the assignee.
- Link the PR to the appropriate Issue or Project+Milestone if no issue has been created.
- **Important**: Do Not Merge the PR unless specifically instructed by an admin.

### After PR Merge

- Delete the branch from the forked repository.
- Clean up the local environment by updating the master branch.

```bash
$ git branch -d <type>/<issue|issue-number>/{<additional-fixes>}
$ git push --delete origin <type>/<issue|issue-number>/{<additional-fixes>}
$ git checkout master
$ git pull upstream
$ git push origin
```

<br>

## **Need some help regarding the basics?🤔**


You can refer to the following articles on the basics of Git and GitHub and also contact the Project Mentors,
in case you are stuck:

- [Forking a Repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
- [Cloning a Repo](https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request)
- [How to create a Pull Request](https://opensource.com/article/19/7/create-pull-request-github)
- [Getting started with Git and GitHub](https://towardsdatascience.com/getting-started-with-git-and-github-6fcd0f2d4ac6)
- [Learn GitHub from Scratch](https://docs.github.com/en/get-started/start-your-journey/git-and-github-learning-resources)

Always adhere to commit message standards and maintain a consistent style.

---
