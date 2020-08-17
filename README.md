# WorkspaceX

## Collaborators
[@YomnaEldawy](https://github.com/YomnaEldawy) <br>
[@SalmaElgammal](https://github.com/SalmaElgammal) <br>
[@Fatma Mohamed Abd El-Aty](https://github.com/Fatma-Mohamed-Abd-El-Aty)

## Overview
WorkspaceX is a system for workspaces exploration. It is used by students to explore nearest workspaces and find more about workspace prices, reviews and events. <br>
This repo contains the back end (APIs) of WorkspaceX. 

## How to contribute (for team members)
1. create a directory with name workspacex
    ```
    mkdir workspacex
    cd workspacex
    ```

2. Initialize a git repository using 
    ``` 
    git init
    ```
3.  execute the following command:
    ``` 
    git remote add origin https://github.com/YomnaEldawy/workspacex-backend.git
    ```
    then enter your username and password.
4. execute
    ```bash
    git pull origin stage
    git checkout stage # All new features should be branched from stage
    ```
5. create a new branch with the name of the feature or the task you are implementing. Example:
    ``` 
    git checkout -b staff-login
    ```
6. when you are done with your feature, commit and push the branch to the repo using the following commands

    ```bash
    git add .
    git commit -m "commit message"
    git push origin staff-login #the name of the branch
    ```
7. If you want to start a new feature (Either you are finished with the first one or not), execute the following commands: I assume you are now implementing staff-login and want to start working on feature2

    ```bash
    git add .
    git commit -m "commit message"
    git checkout stage # Any new feature should be branched from stage
    git checkout -b feature2
    ```
