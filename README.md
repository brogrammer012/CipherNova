# South African Intervarsity Hackathon Submission Template - 2025

Welcome to the official **Hackathon Submission Template** for the **South African Intervarsity Hackathon 2025**! This repository is designed to help participants organize their project submissions in a **consistent, judge-friendly structure** while supporting any tech stack.

---

## 📂 Repository Structure
```
├── assets/
│   └── README.md
├── demo/
│   ├── OVERVIEW.md
│   └── README.md
├── docs/
│   ├── ACKNOWLEDGEMENTS.md
│   ├── SETUP.md
│   ├── TEAM.md
│   └── USAGE.md
├── scripts/
│   └── README.md
├── src/
│   └── README.md
├── vendor/
│   └── README.md
├── .dockerignore
├── .editorconfig
├── .gitattributes
├── .gitignore
├── Dockerfile
├── LICENSE
└── README.md
```
---

### 🔹 Description of Each Folder/File

- **assets/**  
    All assets used by your project such as **images**, **audio files**, **3D models**, **datasets** and so-on, should be placed in this folder.

- **demo/**  
    Your **demo video**, **PowerPoint presentation**, **Overview readme doc** and or any **examples** should be placed in this folder.

- **docs/**  
    Contains essential documentation about your team and project (these must be written by you):
    - `ACKNOWLEDGEMENTS.md` → References all third-party libraries and sources used
    - `SETUP.md` → Instructions for installing dependencies and running the project  
    - `TEAM.md` → Team member names, roles, and contact info  
    - `USAGE.md` → Instructions for using or testing the project 

- **scripts/**  
    All **utility**, **automation** and **project-management** scripts should be placed in this folder.

- **src/**  
    All source code files should be placed in this folder. You may organize this folder as needed (e.g., `backend/`, `frontend/`, `lib/`, `source/` and or `include/` folders and so on).

- **vendor/**  
    All third-party libraries, code and or submodules should be placed in this folder along **with the appropriate licensing and or references**. If you are not able to link the modules from this folder to your codebase properly, you may put the third-party modules inside the `src/` folder with the rest of your code however, it **must be made clear** which modules are **third-party**, along with their **licensing**.
    Since many tech-stacks already use package managers, this `vendor/` folder is for self-included libraries, dependencies and submodules. **Auto-generated** dependency folders like `node_modules/` or `nuget/` should ideally be ignored by `.gitignore`.

- **.dockerignore**  
    Excludes build artifacts and other non-essential files from the Docker image. *You may delete this file if you do not plan on using Docker.*

- **.editorconfig**  
    Standardizes indentation, line endings, and character encoding across editors and platforms. It is **highly recommended** that you use a text editor/IDE that supports **.editorconfig**.

- **.gitattributes**  
    Ensures consistent handling of line endings, text, and binary files across different operating systems.

- **.gitignore**  
    Ignores build artifacts, OS files, IDE configs, and other non-essential files to keep the repository clean.

- **Dockerfile**  
    A "quick start" template **Dockerfile** to serve as a blueprint for containerizing your project in a **Docker image**. *You may delete this file if you do not plan on using Docker.*

- **LICENSE**  
    Default license template for your submission (MIT recommended).
    *You must add the names of your team members to this template.*

- **README.md**  
    Hey wait, that's me!

---

## ✅ Submission Guidelines

1. Create your project's repo off of this template (click the `Use this template` button).  
2. Fill in the `TEAM.md` file with your team members’ information. 
3. Start hacking!
4. Fill in `ACKNOWLEDGEMENTS.md`, `OVERVIEW.md`, `SETUP.md`, `USAGE.md` and `LICENSE`. 
5. Link or include your demo video & PowerPoint in the `demo/` folder.  
6. **Optional:** Include additional documentation and design notes in `docs/`.
7. **Optional:** Include unit tests in `tests/`.
8. Submit the link to your **public GitHub repository**.

---

## 📑 Documentation Checklist

| File                  | Required? | Notes                                                          |
| --------------------- | --------- | -------------------------------------------------------------- |
| `TEAM.md`             | ✅         | Must list all team members, their roles, and institutions      |
| `OVERVIEW.md`         | ✅         | High-level description of your project and its purpose         |
| `SETUP.md`            | ✅         | Instructions to install dependencies and run the project       |
| `USAGE.md`            | ✅         | How to use/test the project after setup                        |
| `ACKNOWLEDGEMENTS.md` | ✅         | Credit all third-party libraries, datasets, and resources used |
| `LICENSE`             | ✅         | Include license type and add your team members’ names          |
| `tests/`              | Optional  | Add test scripts or instructions if relevant                   |
| `Dockerfile`          | Optional  | Only if you choose to containerize your project                |
| Extra docs            | Optional  | Additional guides, design notes, or API references             |

---

## 📌 Tips & Other Remarks

- Keep your code and assets organized within the `src/` and `assets/` directories.  
- Use `.editorconfig` and `.gitattributes` to avoid formatting and line-ending issues.  
- Follow the folder structure strictly — it will make judging smoother and faster.  
- It is highly recommended that you use **Docker** for your submission however, it is **not required**. If you opt to **not** use **Docker**, please ensure that your setup instructions in `SETUP.md` are **straightforward**, **correct**, **comprehensive** and **cross-platform** (if applicable) to ensure that your submission will be graded properly.
- It is also recommended that you work with a **tech-stack** or **build-system** that is **platform-agnostic**. For example: if your project is written in `C++` - which is **platform-dependent**, you may need to ensure that it compiles correctly accross multiple toolchains/compilers for different platforms, thereby creating the added-complexity of having to maintain multiple build-targets - such as having to support both **MSVC for Windows** (using `WIN32` for OS-calls) and **GCC for Linux** (using `POSIX` for OS-calls). However, using a language like `Java` may work much better, since `Java` code is inherently **platform-agnostic** as it runs on a *virtual machine* which abstracts away the lower-level OS-calls.
---

### 💡 Note for First-Time Hackathon Participants
If this is your **first hackathon** or you’re **new to GitHub**, don’t stress — just:  
1. Use this template repo as-is.  
2. Fill in the required documentation files (`TEAM.md`, `OVERVIEW.md`, `SETUP.md`, `USAGE.md`, `ACKNOWLEDGEMENTS.md`, `LICENSE`).  
3. Put your code in the `src/` folder and assets in `assets/`.  

That’s enough for a complete and valid submission 🚀 — the rest (like Docker, tests, extra docs) is **optional polish**.

---

## 🧩 Example Submission
Check out a very basic example submission repository [here](https://github.com/DnA-IntRicate/SAIntervarsityHackathonExampleSubmission2025).

We've also created a **demo video** showcasing the **example submission** and how to get started with this **template repository**, check it out [here](https://youtu.be/e2R9APyatU4).

---

## 🙌 Brought to you by
- [UCT Developer Society](https://www.linkedin.com/company/uct-developers-society)
- [UCT AI Society](https://www.linkedin.com/company/uctaisociety/)
- Stellenbosch AI Society
- [Wits Developer Society](https://www.linkedin.com/company/wits-developer-society/)
- [UJ Developer Society](https://www.linkedin.com/company/uj-developerss-society/)
- [UWC IT Society](https://www.linkedin.com/company/uwc-it-society/)
- [UNISA Developer Society](https://www.linkedin.com/company/unisa-developer-society/)

![Sponsored by](assets/Sponsors.jpg)

### **Good luck and happy hacking!** 🚀
