# Vendor
All third-party libraries, code and or submodules should be placed in this folder along **with the appropriate licensing and or references**. If you are not able to link the modules from this folder to your codebase properly, you may put the third-party modules inside the `src/` folder with the rest of your code however, it **must be made clear** which modules are **third-party**, along with their **licensing**.

Since many tech-stacks already use package managers, this `vendor/` folder is for self-included libraries, dependencies and submodules. **Auto-generated** dependency folders like `node_modules/` or `nuget/` should ideally be ignored by `.gitignore`.

> You may delete this file from your repository.
